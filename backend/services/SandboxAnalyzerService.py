from __future__ import annotations
from datetime import datetime

class LightweightSandbox:
    async def analyze_behavioral_patterns(self, file_path: str) -> dict:
        behaviors = {
            'persistence': [],
            'defense_evasion': [],
            'execution': [],
            'lateral_movement': [],
            'exfiltration': [],
            'command_control': [],
            'impact': [],
        }
        try:
            with open(file_path, 'rb') as f:
                file_content = f.read()

            decoded_strings = self.extract_strings(file_content)
            for string in decoded_strings:
                if 'HKLM\\Software\\Microsoft\\Windows\\Run' in string:
                    behaviors['persistence'].append('Registry Run key modification for startup')
                if 'WinLogon' in string or 'Shell' in string:
                    behaviors['persistence'].append('Winlogon shell replacement')
                if 'IsDebuggerPresent' in string or 'CheckRemoteDebuggerPresent' in string:
                    behaviors['defense_evasion'].append('Debugger detection/evasion')
                if 'Sleep' in string:
                    behaviors['defense_evasion'].append('Sleep calls for timing-based evasion')
                if 'UPX' in string or 'ASPack' in string:
                    behaviors['defense_evasion'].append('Packed/Encrypted executable')
                if 'CreateProcessA' in string or 'CreateProcessW' in string:
                    behaviors['execution'].append('Process creation capability')
                if 'ShellExecute' in string:
                    behaviors['execution'].append('Shell command execution')
                if 'cmd.exe' in string or 'powershell' in string:
                    behaviors['execution'].append('Command shell invocation')
                if 'NetUseAdd' in string or 'WNetAddConnection' in string:
                    behaviors['lateral_movement'].append('Network share access')
                if 'ImpersonateLoggedOnUser' in string:
                    behaviors['lateral_movement'].append('User impersonation')
                if 'InternetOpen' in string or 'HttpSendRequest' in string:
                    behaviors['exfiltration'].append('Network communication capability')
                if 'WriteFile' in string or 'CreateFileA' in string:
                    behaviors['exfiltration'].append('File system access')
                if any(c2 in string.lower() for c2 in ['http://', 'https://', 'ftp://']):
                    behaviors['command_control'].append('C2 communication capability')
                if 'DNS' in string or 'gethostbyname' in string:
                    behaviors['command_control'].append('DNS resolution for C2')
                if 'crypto' in string.lower() or 'encrypt' in string.lower():
                    behaviors['impact'].append('Potential ransomware (encryption capability)')
                if 'delete' in string.lower() or 'remove' in string.lower():
                    behaviors['impact'].append('File deletion capability')

            behaviors = {k: v for k, v in behaviors.items() if v}
            return {'status': 'analyzed', 'behaviors': behaviors, 'analyzed_strings_count': len(decoded_strings), 'confidence': 'high' if behaviors else 'medium'}
        except Exception as exc:
            return {'status': 'error', 'error': str(exc)}

    def extract_strings(self, data: bytes, min_length: int = 4) -> list:
        strings = []
        ascii_str = ''
        for byte in data:
            if 32 <= byte <= 126:
                ascii_str += chr(byte)
            else:
                if len(ascii_str) >= min_length:
                    strings.append(ascii_str)
                ascii_str = ''
        if len(ascii_str) >= min_length:
            strings.append(ascii_str)
        return strings

    async def predict_process_behavior(self, analysis_data: dict) -> dict:
        predicted_processes = []
        if analysis_data.get('behaviors', {}).get('persistence'):
            predicted_processes.append({'name': 'svchost.exe', 'action': 'Create/Modify', 'reason': 'May inject into legitimate system service', 'risk': 'high'})
        if 'cmd.exe' in str(analysis_data.get('behaviors', {})) or 'powershell' in str(analysis_data.get('behaviors', {})):
            predicted_processes.append({'name': 'cmd.exe / powershell.exe', 'action': 'Create', 'reason': 'Would spawn shell for command execution', 'risk': 'high'})
        return {'predicted_processes': predicted_processes, 'timestamp': datetime.now().isoformat()}
