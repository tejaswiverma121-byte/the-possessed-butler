import os
import logging
from typing import Dict, Any, List

logger = logging.getLogger("DecisionEngine")

class DecisionEngine:
    """
    Evaluates detector output and assigns appropriate security policies.
    Configurable risk thresholds:
      - LOW RISK (< 35): Allowed into email assistant as untrusted external data.
      - MEDIUM RISK (35 <= score < 75): Flagged for user review; displays warning; blocks automatic actions.
      - HIGH RISK (>= 75): Quarantined; prevented from entering LLM pipeline.
      - UNAVAILABLE: Scan unavailable; never treated as safe; requires manual review.
    """

    def __init__(
        self,
        medium_threshold: int = None,
        high_threshold: int = None
    ):
        self.medium_threshold = int(medium_threshold or os.getenv("RISK_THRESHOLD_MEDIUM", "35"))
        self.high_threshold = int(high_threshold or os.getenv("RISK_THRESHOLD_HIGH", "75"))

    def evaluate(self, scan_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluates the detector scan result and returns a security policy decision.
        """
        status = scan_result.get("scan_status", "unavailable")

        # 1. Unavailable or incomplete scan
        if status != "completed":
            return {
                "decision": "HOLD_FOR_REVIEW",
                "risk_tier": "SCAN_UNAVAILABLE",
                "risk_score": scan_result.get("risk_score", 50),
                "allow_llm_processing": False,
                "require_user_review": True,
                "allow_automated_actions": False,
                "badge_color": "grey",
                "summary": "Security scan could not be completed. Automated processing is suspended until reviewed.",
                "policy_enforcements": [
                    "Main LLM execution prevented",
                    "Automated actions blocked",
                    "Requires human supervisor verification"
                ]
            }

        risk_score = int(scan_result.get("risk_score", 0))
        attack_detected = scan_result.get("attack_detected", False)
        classification = scan_result.get("classification", "benign")

        # 2. HIGH RISK (score >= high_threshold or explicitly malicious)
        if risk_score >= self.high_threshold or classification == "malicious":
            return {
                "decision": "QUARANTINE_BLOCKED",
                "risk_tier": "HIGH_RISK",
                "risk_score": risk_score,
                "allow_llm_processing": False,
                "require_user_review": True,
                "allow_automated_actions": False,
                "badge_color": "red",
                "summary": "Potentially malicious prompt injection detected. Content quarantined from LLM pipeline.",
                "policy_enforcements": [
                    "Direct LLM ingestion blocked to prevent prompt hijacking",
                    "Tool and action execution disabled",
                    "Email marked as high-risk threat",
                    "Quarantine isolation active"
                ]
            }

        # 3. MEDIUM RISK (medium_threshold <= score < high_threshold or suspicious)
        if risk_score >= self.medium_threshold or classification == "suspicious" or attack_detected:
            return {
                "decision": "FLAGGED_FOR_REVIEW",
                "risk_tier": "MEDIUM_RISK",
                "risk_score": risk_score,
                "allow_llm_processing": False, # Prevent automated ingestion without review
                "require_user_review": True,
                "allow_automated_actions": False,
                "badge_color": "yellow",
                "summary": "Suspicious instructions identified. User review required before assistant processing.",
                "policy_enforcements": [
                    "Security warning displayed to user",
                    "Autonomous actions disabled",
                    "Restricted preview mode only",
                    "Requires user confirmation to synthesize"
                ]
            }

        # 4. LOW RISK (score < medium_threshold)
        return {
            "decision": "ALLOW_UNTRUSTED",
            "risk_tier": "LOW_RISK",
            "risk_score": risk_score,
            "allow_llm_processing": True,
            "require_user_review": False,
            "allow_automated_actions": False, # Emails NEVER directly authorize sensitive actions without explicit user approval
            "badge_color": "green",
            "summary": "Legitimate content verified. Assistant may read and summarize as untrusted external data.",
            "policy_enforcements": [
                "Treated strictly as untrusted external data",
                "No authorization to execute tools or override system prompts",
                "LLM processing permitted in safe isolated sandbox"
            ]
        }
