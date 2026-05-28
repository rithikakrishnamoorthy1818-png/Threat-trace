from __future__ import annotations

class MalwareExplainer:
    async def explain_file_analysis(self, analysis_data: dict) -> str:
        explanation_parts = []
        risk_score = analysis_data.get('risk_score', 0)
        if risk_score > 80:
            explanation_parts.append(f"This file poses a CRITICAL THREAT (risk score: {risk_score}/100).")
        elif risk_score > 60:
            explanation_parts.append(f"This file is MALICIOUS (risk score: {risk_score}/100).")
        elif risk_score > 30:
            explanation_parts.append(f"This file is SUSPICIOUS (risk score: {risk_score}/100).")
        else:
            explanation_parts.append(f"This file appears SAFE (risk score: {risk_score}/100).")

        suspicious_strings = analysis_data.get('suspicious_strings', [])
        if 'CreateRemoteThread' in suspicious_strings or 'WriteProcessMemory' in suspicious_strings:
            explanation_parts.append('It attempts PROCESS INJECTION to hide itself or steal data from other programs.')
        if 'WinHTTP' in suspicious_strings or 'URLDownloadToFile' in suspicious_strings:
            explanation_parts.append('It can DOWNLOAD additional malware from the internet.')
        if 'SetWindowsHookEx' in suspicious_strings:
            explanation_parts.append('It hooks system functions to monitor keyboard input or capture credentials.')
        if 'cmd.exe' in suspicious_strings or 'powershell' in suspicious_strings:
            explanation_parts.append('It can EXECUTE COMMANDS on your system for remote control.')
        if 'HKEY_LOCAL_MACHINE' in suspicious_strings or 'RegSetValue' in suspicious_strings:
            explanation_parts.append('It modifies Windows REGISTRY for persistence, meaning it survives reboots.')
        if 'Sleep' in suspicious_strings or 'OutputDebugString' in suspicious_strings:
            explanation_parts.append('It contains ANTI-ANALYSIS techniques to evade detection.')

        entropy = analysis_data.get('entropy', 0)
        if entropy > 7:
            explanation_parts.append('The file is PACKED or ENCRYPTED, a common malware evasion technique.')

        file_type = analysis_data.get('file_type', 'unknown')
        if file_type == 'exe':
            explanation_parts.append('Being an executable file (.exe), it can run directly as a program.')
        elif file_type == 'dll':
            explanation_parts.append('Being a library file (.dll), it can be loaded by other programs and execute code.')

        if risk_score > 60:
            explanation_parts.append('RECOMMENDATION: DO NOT EXECUTE. Delete this file and scan your system.')
        elif risk_score > 30:
            explanation_parts.append('RECOMMENDATION: QUARANTINE. Further analysis required.')
        else:
            explanation_parts.append('RECOMMENDATION: File appears safe, but always verify source.')

        return ' '.join(explanation_parts)

    async def explain_url_analysis(self, analysis_data: dict) -> str:
        explanation_parts = []
        classification = analysis_data.get('classification')
        risk_score = analysis_data.get('risk_score', 0)

        if classification == 'safe':
            explanation_parts.append(f"This URL is SAFE (risk score: {risk_score}/100). No threats detected.")
        elif classification == 'phishing':
            explanation_parts.append(f"This URL is a PHISHING ATTACK (risk score: {risk_score}/100).")
            explanation_parts.append('Phishing sites trick victims into entering passwords or payment data.')
        elif classification == 'malicious':
            explanation_parts.append(f"This URL hosts MALWARE (risk score: {risk_score}/100).")
            explanation_parts.append('Visiting this site could infect your device with malicious software.')
        else:
            explanation_parts.append(f"This URL is SUSPICIOUS (risk score: {risk_score}/100). Proceed with caution.")

        domain_age = analysis_data.get('domain_age_days', 0)
        if domain_age < 7:
            explanation_parts.append(f"The domain was registered only {domain_age} days ago, a common phishing tactic.")

        if not analysis_data.get('has_valid_ssl', True):
            explanation_parts.append('The website lacks a valid HTTPS certificate and is unsafe for sensitive data.')

        indicators = analysis_data.get('phishing_indicators', [])
        if 'urgency_language' in indicators:
            explanation_parts.append('Urgent language is used to pressure immediate action.')
        if 'credential_form' in indicators:
            explanation_parts.append('The page contains a credential form likely used for harvesting.')
        if 'lookalike_domain' in indicators:
            explanation_parts.append('The domain mimics a legitimate company name.')
        if 'suspicious_tld' in indicators:
            explanation_parts.append('The domain uses a suspicious TLD frequently seen in phishing campaigns.')

        if risk_score > 75:
            explanation_parts.append('RECOMMENDATION: DO NOT VISIT. This is a confirmed threat.')
        elif risk_score > 50:
            explanation_parts.append('RECOMMENDATION: AVOID VISITING. Do not enter personal information.')
        else:
            explanation_parts.append('RECOMMENDATION: Safe to visit. Normal security practices apply.')

        return ' '.join(explanation_parts)
