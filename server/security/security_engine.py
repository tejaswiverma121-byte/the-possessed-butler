import time
import uuid
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime

from .model_loader import ModelLoader
from .email_preprocessor import EmailPreprocessor
from .prompt_injection_detector import PromptInjectionDetector
from .decision_engine import DecisionEngine

logger = logging.getLogger("SecurityEngine")

class SecurityEngine:
    """
    Unified Security Engine for Prompt Injection Detection and Prevention.
    Orchestrates preprocessing, classification, decision making, audit logging,
    and runtime performance measurement.
    """
    _instance = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.loader = ModelLoader.get_instance()
        self.detector = PromptInjectionDetector(self.loader)
        self.decision_engine = DecisionEngine()
        self.scan_history: List[Dict[str, Any]] = []
        self.max_history = 200

        # Preload model in background or on first init
        self._warmup_model()

    def _warmup_model(self):
        try:
            logger.info("Initializing security model weights...")
            self.loader.load_model()
        except Exception as e:
            logger.warning(f"Deferred model loading due to: {e}")

    def scan_email(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Full end-to-end security pipeline:
        1. Preprocess email and attachments
        2. Chunk text and run local inference through Prompt Guard
        3. Determine policy decision (LOW, MEDIUM, HIGH, UNAVAILABLE)
        4. Log audit record and compute latency
        """
        start_time = time.perf_counter()

        # Step 1: Preprocessing
        preprocessed = EmailPreprocessor.preprocess_email(email_data)
        scan_text = preprocessed["scan_text"]
        hidden_findings = preprocessed["hidden_findings"]

        # Step 2: Prompt Guard Classification
        detection_result = self.detector.scan(scan_text, hidden_findings)

        # Step 3: Decision Engine
        decision_result = self.decision_engine.evaluate(detection_result)

        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        # Combine into complete scan report
        scan_id = f"pg-{int(time.time())}-{uuid.uuid4().hex[:6]}"
        email_id = email_data.get("id") or f"em-{uuid.uuid4().hex[:6]}"

        report = {
            "scan_id": scan_id,
            "email_id": email_id,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "latency_ms": elapsed_ms,
            "scan_status": detection_result.get("scan_status"),
            "model": detection_result.get("model"),
            "attack_detected": detection_result.get("attack_detected", False),
            "classification": detection_result.get("classification"),
            "risk_score": detection_result.get("risk_score", 0),
            "confidence": detection_result.get("confidence", 0.0),
            "flagged_chunks": detection_result.get("flagged_chunks", []),
            "total_chunks_scanned": detection_result.get("total_chunks_scanned", 0),
            "explanation": detection_result.get("explanation"),
            "has_attachments_scanned": preprocessed["has_attachments_scanned"],
            "attachment_count": preprocessed["attachment_count"],
            "hidden_findings": hidden_findings,
            "decision": decision_result["decision"],
            "risk_tier": decision_result["risk_tier"],
            "allow_llm_processing": decision_result["allow_llm_processing"],
            "require_user_review": decision_result["require_user_review"],
            "badge_color": decision_result["badge_color"],
            "summary": decision_result["summary"],
            "policy_enforcements": decision_result["policy_enforcements"]
        }

        # Step 4: Record history (redact long raw body to avoid logging full private contents)
        history_item = {
            "scan_id": scan_id,
            "email_id": email_id,
            "timestamp": report["timestamp"],
            "subject": preprocessed["subject"][:80],
            "from": preprocessed["from_address"][:80],
            "risk_tier": report["risk_tier"],
            "risk_score": report["risk_score"],
            "decision": report["decision"],
            "badge_color": report["badge_color"],
            "latency_ms": elapsed_ms,
            "flagged_chunks_count": len(report["flagged_chunks"]),
            "attack_detected": report["attack_detected"]
        }
        self.scan_history.insert(0, history_item)
        if len(self.scan_history) > self.max_history:
            self.scan_history.pop()

        return report

    def get_scan_history(self, limit: int = 50) -> List[Dict[str, Any]]:
        return self.scan_history[:limit]

    def get_statistics(self) -> Dict[str, Any]:
        """
        Computes dynamic statistics over all recorded scans without hardcoded numbers.
        """
        total = len(self.scan_history)
        if total == 0:
            return {
                "total_scans": 0,
                "low_risk_count": 0,
                "medium_risk_count": 0,
                "high_risk_count": 0,
                "unavailable_count": 0,
                "attacks_detected_count": 0,
                "average_risk_score": 0.0,
                "average_latency_ms": 0.0,
                "model_name": self.loader.model_name,
                "model_ready": self.loader.is_ready,
                "device": str(self.loader.device) if self.loader.device else "unknown"
            }

        low_count = sum(1 for s in self.scan_history if s.get("risk_tier") == "LOW_RISK")
        med_count = sum(1 for s in self.scan_history if s.get("risk_tier") == "MEDIUM_RISK")
        high_count = sum(1 for s in self.scan_history if s.get("risk_tier") == "HIGH_RISK")
        unavail_count = sum(1 for s in self.scan_history if s.get("risk_tier") == "SCAN_UNAVAILABLE")
        attacks_count = sum(1 for s in self.scan_history if s.get("attack_detected"))

        avg_score = round(sum(s.get("risk_score", 0) for s in self.scan_history) / total, 2)
        avg_latency = round(sum(s.get("latency_ms", 0.0) for s in self.scan_history) / total, 2)

        return {
            "total_scans": total,
            "low_risk_count": low_count,
            "medium_risk_count": med_count,
            "high_risk_count": high_count,
            "unavailable_count": unavail_count,
            "attacks_detected_count": attacks_count,
            "average_risk_score": avg_score,
            "average_latency_ms": avg_latency,
            "model_name": self.loader.model_name,
            "model_ready": self.loader.is_ready,
            "device": str(self.loader.device) if self.loader.device else "unknown"
        }
