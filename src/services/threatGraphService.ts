import type { FileAnalysisDetail, ThreatGraphEdge, ThreatGraphNode } from '../types'

export function generateThreatGraph(detail: FileAnalysisDetail): {
  nodes: ThreatGraphNode[]
  edges: ThreatGraphEdge[]
} {
  const nodes: ThreatGraphNode[] = []
  const edges: ThreatGraphEdge[] = []

  const malwareId = detail.scanId
  nodes.push({
    id: malwareId,
    label: detail.malwareFamily,
    type: 'malware',
    color: '#ff1744',
  })

  nodes.push({
    id: `hash_${malwareId}`,
    label: `SHA256:${detail.scanId.slice(0, 12)}…`,
    type: 'hash',
    color: '#9e9e9e',
  })
  edges.push({
    id: `${malwareId}-hash`,
    source: malwareId,
    target: `hash_${malwareId}`,
    label: 'has hash',
  })

  for (const url of detail.contactedUrls) {
    const id = `url_${url}`
    nodes.push({ id, label: url, type: 'url', color: '#00bcd4' })
    edges.push({
      id: `${malwareId}-${id}`,
      source: malwareId,
      target: id,
      label: 'contacts',
      animated: true,
    })
  }

  for (const ip of detail.contactedIps) {
    const id = `ip_${ip}`
    nodes.push({ id, label: ip, type: 'ip', color: '#ff9100' })
    edges.push({ id: `${malwareId}-${id}`, source: malwareId, target: id, label: 'connects to' })
  }

  for (const [tactic, items] of Object.entries(detail.behaviors)) {
    for (const item of items) {
      const id = `behavior_${tactic}_${item.slice(0, 12)}`
      nodes.push({ id, label: item, type: 'behavior', color: '#ff69b4' })
      edges.push({ id: `${malwareId}-${id}`, source: malwareId, target: id, label: 'performs' })
    }
  }

  if (detail.threatGroup) {
    const gid = `group_${detail.threatGroup}`
    nodes.push({
      id: gid,
      label: detail.threatGroup,
      type: 'threat_group',
      color: '#9c27b0',
    })
    edges.push({
      id: `${gid}-${malwareId}`,
      source: gid,
      target: malwareId,
      label: 'attributed to',
    })
  }

  return { nodes, edges }
}
