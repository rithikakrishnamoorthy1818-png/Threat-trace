from __future__ import annotations

class ThreatGraphService:
    async def generate_threat_graph(self, scan_result: dict) -> dict:
        nodes = []
        edges = []

        malware_node = {
            'id': scan_result.get('file_hash', 'unknown_hash'),
            'label': scan_result.get('malware_family', 'Unknown Malware'),
            'type': 'malware',
            'color': '#ff1744',
            'data': {
                'hash': scan_result.get('file_hash', ''),
                'family': scan_result.get('malware_family', ''),
                'risk_score': scan_result.get('risk_score', 0),
            },
        }
        nodes.append(malware_node)

        for url in scan_result.get('contacted_urls', []):
            url_node = {'id': f"url_{url}", 'label': url, 'type': 'url', 'color': '#00bcd4'}
            nodes.append(url_node)
            edges.append({'id': f"{malware_node['id']}-{url_node['id']}", 'source': malware_node['id'], 'target': url_node['id'], 'label': 'contacts', 'animated': True})

        for ip in scan_result.get('contacted_ips', []):
            ip_node = {'id': f"ip_{ip}", 'label': ip, 'type': 'ip', 'color': '#ff9100'}
            nodes.append(ip_node)
            edges.append({'id': f"{malware_node['id']}-{ip_node['id']}", 'source': malware_node['id'], 'target': ip_node['id'], 'label': 'connects to'})

        for behavior in scan_result.get('detected_behaviors', []):
            behavior_node = {'id': f"behavior_{behavior}", 'label': behavior, 'type': 'behavior', 'color': '#ff69b4'}
            nodes.append(behavior_node)
            edges.append({'id': f"{malware_node['id']}-{behavior_node['id']}", 'source': malware_node['id'], 'target': behavior_node['id'], 'label': 'performs'})

        threat_group = scan_result.get('threat_group')
        if threat_group:
            group_node = {'id': f"group_{threat_group}", 'label': threat_group, 'type': 'threat_group', 'color': '#9c27b0'}
            nodes.append(group_node)
            edges.append({'id': f"group_{threat_group}-{malware_node['id']}", 'source': group_node['id'], 'target': malware_node['id'], 'label': 'attributed to', 'dashed': True})

        return {'nodes': nodes, 'edges': edges}
