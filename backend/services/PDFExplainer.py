from __future__ import annotations
import re

class PDFExplainerService:
    async def analyze_pdf_intent(self, pdf_path: str, extracted_text: str) -> str:
        explanation_parts = []
        risk_indicators = []
        text = extracted_text.lower()

        urgent_keywords = ['verify', 'confirm', 'urgent', 'act now', 'immediate action', 'update required', 'update payment', 'suspicious activity']
        found_urgent = [k for k in urgent_keywords if k in text]
        if found_urgent:
            explanation_parts.append(f"Uses URGENCY-BASED PHISHING language: {', '.join(found_urgent)}.")
            risk_indicators.append('urgency_phishing')

        credential_keywords = ['enter password', 'enter username', 'login credentials', 'social security', 'credit card', 'bank account', 'cvv']
        found_credentials = [k for k in credential_keywords if k in text]
        if found_credentials:
            explanation_parts.append(f"Attempts CREDENTIAL HARVESTING by requesting: {', '.join(found_credentials)}.")
            risk_indicators.append('credential_harvesting')

        impersonation_keywords = ['apple', 'microsoft', 'google', 'amazon', 'paypal', 'bank', 'government']
        found_impersonation = [k for k in impersonation_keywords if len(re.findall(r'\\b' + re.escape(k) + r'\\b', text)) > 2]
        if found_impersonation:
            explanation_parts.append(f"IMPERSONATES trusted entities: {', '.join(found_impersonation)}.")
            risk_indicators.append('impersonation')

        urls = re.findall(r'http[s]?://[^\s)\]]+', extracted_text)
        suspicious_urls = [u for u in urls if ('apple' in text and 'apple' not in u.lower()) or ('microsoft' in text and 'microsoft' not in u.lower())]
        if suspicious_urls:
            explanation_parts.append(f"SUSPICIOUS LINKS detected: {', '.join(suspicious_urls[:3])}.")
            risk_indicators.append('mismatched_urls')

        if len(risk_indicators) >= 3:
            explanation_parts.append('ASSESSMENT: HIGH CONFIDENCE PHISHING ATTACK.')
        elif len(risk_indicators) == 2:
            explanation_parts.append('ASSESSMENT: STRONG PHISHING INDICATORS.')
        elif len(risk_indicators) == 1:
            explanation_parts.append('ASSESSMENT: POTENTIAL PHISHING characteristics.')
        else:
            explanation_parts.append('ASSESSMENT: No obvious phishing indicators detected.')

        return ' '.join(explanation_parts)
