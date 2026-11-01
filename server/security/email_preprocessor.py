import re
import html
from typing import Dict, Any, List

class EmailPreprocessor:
    """
    Preprocesses raw email data for security inspection.
    Extracts text from HTML, inspects hidden injection channels, and normalizes
    content without discarding suspicious strings or attack payloads.
    """

    # Regex for zero-width / invisible Unicode tokens
    ZERO_WIDTH_REGEX = re.compile(r'[\u200B-\u200D\uFEFF\u2060\u180E]')
    # Regex for HTML comments (common prompt injection hiding spot)
    HTML_COMMENT_REGEX = re.compile(r'<!--([\s\S]*?)-->')
    # Regex for hidden CSS styles (font-size:0, display:none, opacity:0, visibility:hidden)
    HIDDEN_STYLE_REGEX = re.compile(
        r'<[^>]*(?:display:\s*none|font-size:\s*0|opacity:\s*0|visibility:\s*hidden|color:\s*transparent|text-indent:\s*-\d+)[^>]*>([\s\S]*?)<\/[^>]+>',
        re.IGNORECASE
    )
    # Strip HTML tags
    HTML_TAG_REGEX = re.compile(r'<[^>]+>')

    @classmethod
    def extract_text_from_html(cls, html_content: str) -> str:
        """Converts HTML markup into clean readable text while preserving structural whitespace."""
        if not html_content or not isinstance(html_content, str):
            return ""

        # Replace break and paragraph tags with newlines
        text = re.sub(r'<(?:br|p|div|tr|li)[\s/>]', '\n', html_content, flags=re.IGNORECASE)
        # Strip all other HTML tags
        text = cls.HTML_TAG_REGEX.sub(' ', text)
        # Decode HTML entities (e.g., &amp; &lt;)
        text = html.unescape(text)
        # Collapse excessive whitespace but keep paragraphs
        lines = [re.sub(r'[ \t]+', ' ', line).strip() for line in text.split('\n')]
        return '\n'.join([line for line in lines if line])

    @classmethod
    def inspect_hidden_channels(cls, raw_html: str, raw_text: str) -> List[str]:
        """Detects concealed text in comments, zero-width characters, and hidden styling."""
        detected = []

        if raw_html:
            # Check for hidden HTML comments
            comments = cls.HTML_COMMENT_REGEX.findall(raw_html)
            for c in comments:
                cleaned_comment = c.strip()
                if len(cleaned_comment) > 5 and any(w in cleaned_comment.lower() for w in ['ignore', 'override', 'system', 'prompt', 'directive', 'token']):
                    detected.append(f"Concealed HTML comment directive: {cleaned_comment[:80]}...")

            # Check for hidden CSS elements
            hidden_elements = cls.HIDDEN_STYLE_REGEX.findall(raw_html)
            for h in hidden_elements:
                txt = cls.extract_text_from_html(h).strip()
                if txt:
                    detected.append(f"Hidden CSS styling payload: {txt[:80]}...")

        # Check for zero-width unicode
        combined = (raw_html or '') + ' ' + (raw_text or '')
        if cls.ZERO_WIDTH_REGEX.search(combined):
            detected.append("Concealed zero-width Unicode characters identified in message payload")

        return detected

    @classmethod
    def preprocess_email(cls, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main preprocessing pipeline:
        Preserves original email while creating a normalized scan buffer.
        """
        subject = str(email_data.get("subject", "") or "").strip()
        from_addr = str(email_data.get("from", "") or "").strip()
        body_text = str(email_data.get("body", "") or "")
        html_content = str(email_data.get("html", "") or "")
        attachments = email_data.get("attachments", []) or []

        # Extract text from HTML if body text is missing or shorter
        extracted_html_text = cls.extract_text_from_html(html_content) if html_content else ""
        primary_body = body_text if len(body_text) >= len(extracted_html_text) else extracted_html_text

        # Inspect hidden channels
        hidden_findings = cls.inspect_hidden_channels(html_content, body_text)

        # Process attachments if TXT or text content
        attachment_texts = []
        for att in attachments:
            name = att.get("filename") or att.get("name") or "attachment"
            content = att.get("content") or att.get("text") or ""
            if isinstance(content, str) and content.strip():
                # Never execute code or macros; strictly treat as raw textual input
                clean_att = cls.extract_text_from_html(content) if '<' in content else content
                attachment_texts.append(f"[Attachment: {name}]\n{clean_att.strip()}")

        # Build full consolidated scan text
        sections = []
        if from_addr:
            sections.append(f"From: {from_addr}")
        if subject:
            sections.append(f"Subject: {subject}")
        if primary_body:
            sections.append(f"Body:\n{primary_body}")
        if attachment_texts:
            sections.append("Attachments:\n" + "\n\n".join(attachment_texts))

        consolidated_scan_text = "\n\n".join(sections)

        return {
            "original_email": email_data,
            "subject": subject,
            "from_address": from_addr,
            "scan_text": consolidated_scan_text,
            "char_count": len(consolidated_scan_text),
            "hidden_findings": hidden_findings,
            "has_attachments_scanned": len(attachment_texts) > 0,
            "attachment_count": len(attachment_texts)
        }
