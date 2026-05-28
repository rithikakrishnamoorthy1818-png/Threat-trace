from __future__ import annotations

class RiskPredictionEngine:
    async def predict_malware_probability(self, analysis_data: dict) -> float:
        score = 0
        score += min(len(analysis_data.get('suspicious_strings', [])) * 5, 40)
        score += 30 if analysis_data.get('is_packed') else 0
        score += 20 if analysis_data.get('entropy', 0) > 7 else 0
        return min(score / 100, 1.0)

    async def predict_ransomware_likelihood(self, analysis_data: dict) -> float:
        score = 0
        strings = analysis_data.get('suspicious_strings', [])
        behaviors = analysis_data.get('detected_behaviors', {})
        if any(api in strings for api in ['CryptEncrypt', 'RijndaelEncrypt', 'AES_Encrypt', 'EncryptFileA']):
            score += 40
        if 'CreateFileA' in strings or 'WriteFile' in strings:
            score += 15
        if 'RegSetValue' in strings or 'HKLM' in strings:
            score += 15
        if 'TerminateProcess' in strings:
            score += 20
        if 'impact' in behaviors:
            score += 10
        return min(score / 100, 1.0)

    async def predict_phishing_likelihood(self, url_data: dict) -> float:
        score = 0
        domain_age = url_data.get('domain_age_days', 365)
        if domain_age < 7:
            score += 40
        elif domain_age < 30:
            score += 20
        if not url_data.get('has_valid_ssl'):
            score += 25
        if url_data.get('has_login_form'):
            score += 20
        urgent_count = len(url_data.get('urgent_language', []))
        score += min(urgent_count * 5, 15)
        if url_data.get('is_lookalike_domain'):
            score += 30
        if url_data.get('suspicious_tld'):
            score += 10
        return min(score / 100, 1.0)

    async def predict_suspicious_behavior_score(self, all_data: dict) -> dict:
        malware_score = await self.predict_malware_probability(all_data)
        ransomware_score = await self.predict_ransomware_likelihood(all_data)
        phishing_score = await self.predict_phishing_likelihood(all_data) if 'url' in all_data else 0
        return {
            'malware_probability': malware_score,
            'ransomware_probability': ransomware_score,
            'phishing_probability': phishing_score,
            'overall_risk': max(malware_score, ransomware_score, phishing_score),
            'threat_types_detected': [
                {'type': 'Malware', 'probability': malware_score, 'explanation': self._get_malware_explanation(all_data)},
                {'type': 'Ransomware', 'probability': ransomware_score, 'explanation': self._get_ransomware_explanation(all_data)},
                {'type': 'Phishing', 'probability': phishing_score, 'explanation': self._get_phishing_explanation(all_data)},
            ],
        }

    def _get_malware_explanation(self, data: dict) -> str:
        if data.get('risk_score', 0) > 70:
            return 'High entropy, suspicious APIs, and dangerous behavior patterns detected'
        return 'File shows suspicious characteristics but confidence is moderate'

    def _get_ransomware_explanation(self, data: dict) -> str:
        if 'CryptEncrypt' in data.get('suspicious_strings', []):
            return 'Encryption APIs detected, characteristic of ransomware'
        return 'No strong ransomware indicators detected'

    def _get_phishing_explanation(self, data: dict) -> str:
        if data.get('domain_age_days', 365) < 7:
            return 'Brand new domain with phishing characteristics'
        if data.get('is_lookalike_domain'):
            return 'Domain mimics legitimate service'
        return 'Domain appears legitimate but exercise caution'
