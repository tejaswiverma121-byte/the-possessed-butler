import logging
import torch
from typing import Dict, Any, List
from .model_loader import ModelLoader

logger = logging.getLogger("PromptInjectionDetector")

class PromptInjectionDetector:
    """
    Performs chunked local inference using the pretrained Prompt Guard model.
    Handles tokenization, 512-token context chunking, softmax score aggregation,
    and label configuration inspection.
    """

    CHUNK_SIZE = 450
    CHUNK_OVERLAP = 60

    def __init__(self, model_loader: ModelLoader = None):
        self.loader = model_loader or ModelLoader.get_instance()

    def _determine_label_mapping(self, model) -> Dict[str, int]:
        """
        Dynamically inspects model configuration to determine benign vs malicious indices.
        Prompt Guard typically outputs:
        id2label: {0: 'LABEL_0', 1: 'LABEL_1', 2: 'LABEL_2'} or {0: 'BENIGN', 1: 'INJECTION', 2: 'JAILBREAK'}
        """
        id2label = getattr(model.config, 'id2label', {}) or {}
        num_labels = getattr(model.config, 'num_labels', 2)

        mapping = {"benign_idx": 0, "malicious_indices": [1]}

        # Check explicit label strings first
        if id2label:
            malicious = []
            benign = None
            for idx, label_name in id2label.items():
                name_lower = str(label_name).lower()
                if any(k in name_lower for k in ['inject', 'jailbreak', 'attack', 'malicious', 'threat']):
                    malicious.append(int(idx))
                elif any(k in name_lower for k in ['benign', 'safe', 'normal', 'clean']):
                    benign = int(idx)
            if malicious:
                mapping = {
                    "benign_idx": benign if benign is not None else 0,
                    "malicious_indices": malicious
                }
                return mapping

        if num_labels == 3:
            # Standard Meta Prompt-Guard-86M / Llama-Prompt-Guard-2 (0: Benign, 1: Injection, 2: Jailbreak)
            mapping = {"benign_idx": 0, "malicious_indices": [1, 2]}

        return mapping

    def chunk_text(self, text: str, tokenizer) -> List[Dict[str, Any]]:
        """
        Tokenizes text and divides it into overlapping windows within the 512-token limit.
        """
        if not text:
            return []

        tokens = tokenizer.encode(text, add_special_tokens=False)
        total_tokens = len(tokens)

        if total_tokens <= self.CHUNK_SIZE:
            return [{
                "chunk_index": 0,
                "token_start": 0,
                "token_end": total_tokens,
                "token_ids": tokens,
                "text_snippet": tokenizer.decode(tokens, skip_special_tokens=True)
            }]

        chunks = []
        step = self.CHUNK_SIZE - self.CHUNK_OVERLAP
        chunk_idx = 0

        for start in range(0, total_tokens, step):
            end = min(start + self.CHUNK_SIZE, total_tokens)
            chunk_tokens = tokens[start:end]
            chunks.append({
                "chunk_index": chunk_idx,
                "token_start": start,
                "token_end": end,
                "token_ids": chunk_tokens,
                "text_snippet": tokenizer.decode(chunk_tokens, skip_special_tokens=True)
            })
            chunk_idx += 1
            if end >= total_tokens:
                break

        return chunks

    def scan(self, scan_text: str, hidden_findings: List[str] = None) -> Dict[str, Any]:
        """
        Scans all text chunks through the Prompt Guard model.
        Returns a structured assessment.
        """
        if not self.loader.is_ready:
            # Fallback check if model can be initialized now
            if not self.loader.load_model():
                return {
                    "scan_status": "unavailable",
                    "model": self.loader.model_name,
                    "attack_detected": False,
                    "classification": "scan_unavailable",
                    "risk_score": 50,
                    "confidence": 0.0,
                    "flagged_chunks": [],
                    "explanation": f"Prompt Guard model unavailable: {self.loader.load_error or 'Weights not initialized'}. Mandatory human review required."
                }

        tokenizer = self.loader.tokenizer
        model = self.loader.model
        device = self.loader.device

        chunks = self.chunk_text(scan_text, tokenizer)
        if not chunks:
            return {
                "scan_status": "completed",
                "model": self.loader.model_name,
                "attack_detected": False,
                "classification": "benign",
                "risk_score": 0,
                "confidence": 1.0,
                "flagged_chunks": [],
                "explanation": "Empty message content; no instructions present."
            }

        label_map = self._determine_label_mapping(model)
        chunk_results = []
        max_malicious_prob = 0.0
        flagged_chunk_indices = []

        with torch.no_grad():
            for c in chunks:
                # Add special tokens [CLS] and [SEP]
                input_ids = [tokenizer.cls_token_id or 1] + c["token_ids"] + [tokenizer.sep_token_id or 2]
                tensor_ids = torch.tensor([input_ids], dtype=torch.long, device=device)
                attention_mask = torch.ones_like(tensor_ids)

                outputs = model(input_ids=tensor_ids, attention_mask=attention_mask)
                logits = outputs.logits
                probs = torch.softmax(logits, dim=-1)[0].cpu().numpy()

                # Sum probabilities of all malicious classes (injection + jailbreak)
                malicious_prob = float(sum(probs[i] for i in label_map["malicious_indices"] if i < len(probs)))
                benign_prob = float(probs[label_map["benign_idx"]]) if label_map["benign_idx"] < len(probs) else (1.0 - malicious_prob)

                chunk_info = {
                    "chunk_index": c["chunk_index"],
                    "token_range": f"{c['token_start']}-{c['token_end']}",
                    "malicious_prob": round(malicious_prob, 4),
                    "benign_prob": round(benign_prob, 4),
                }
                chunk_results.append(chunk_info)

                if malicious_prob > max_malicious_prob:
                    max_malicious_prob = malicious_prob

                # Flag chunk if malicious probability exceeds 0.5
                if malicious_prob >= 0.5:
                    flagged_chunk_indices.append(c["chunk_index"])

        # Incorporate hidden channel discoveries into risk score
        hidden_penalty = 0.0
        if hidden_findings and len(hidden_findings) > 0:
            hidden_penalty = 0.35 # Strongly penalize hidden HTML comments / zero-width characters

        combined_risk_prob = min(1.0, max_malicious_prob + hidden_penalty)
        risk_score = int(round(combined_risk_prob * 100))
        attack_detected = combined_risk_prob >= 0.5 or len(flagged_chunk_indices) > 0

        classification = "malicious" if combined_risk_prob >= 0.65 else ("suspicious" if combined_risk_prob >= 0.35 else "benign")

        # Formulate explanation
        explanations = []
        if flagged_chunk_indices:
            explanations.append(f"Prompt injection patterns detected in chunk(s) {flagged_chunk_indices}.")
        if hidden_findings:
            explanations.extend(hidden_findings)
        if not explanations:
            explanations.append("Content evaluated as safe and legitimate correspondence.")

        return {
            "scan_status": "completed",
            "model": self.loader.model_name,
            "attack_detected": attack_detected,
            "classification": classification,
            "risk_score": risk_score,
            "confidence": round(float(combined_risk_prob if attack_detected else (1.0 - combined_risk_prob)), 2),
            "flagged_chunks": flagged_chunk_indices,
            "total_chunks_scanned": len(chunks),
            "chunk_results": chunk_results,
            "explanation": " ".join(explanations)
        }
