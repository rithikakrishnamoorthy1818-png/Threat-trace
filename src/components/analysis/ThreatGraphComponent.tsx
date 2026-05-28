import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { Maximize2, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Button } from '../common/Button'
import type { ThreatGraphEdge, ThreatGraphNode } from '../../types'
import { cn } from '../../utils/cn'

type Props = {
  scanId: string
  nodes: ThreatGraphNode[]
  edges: ThreatGraphEdge[]
}

const NODE_SHAPES: Record<ThreatGraphNode['type'], string> = {
  malware: 'rounded-full',
  url: 'rounded-lg',
  ip: 'rotate-45 rounded-sm',
  behavior: 'rounded-full',
  threat_group: 'rounded-xl',
  hash: 'rounded-md',
}

function toFlowNodes(raw: ThreatGraphNode[]): Node[] {
  return raw.map((n, i) => ({
    id: n.id,
    data: { label: n.label, type: n.type },
    position: { x: (i % 4) * 220, y: Math.floor(i / 4) * 120 },
    style: {
      background: '#0d1117',
      border: `2px solid ${n.color}`,
      color: '#e6edf3',
      padding: 10,
      fontSize: 11,
      boxShadow: `0 0 12px ${n.color}44`,
      maxWidth: 180,
    },
    className: NODE_SHAPES[n.type],
  }))
}

function toFlowEdges(raw: ThreatGraphEdge[]): Edge[] {
  return raw.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    ...(e.animated ? { animated: true as const } : {}),
    style: { stroke: '#00bcd4', strokeWidth: 1.5 },
    labelStyle: { fill: '#8b949e', fontSize: 10 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#00bcd4' },
  }))
}

export function ThreatGraphComponent({ scanId, nodes: rawNodes, edges: rawEdges }: Props) {
  const [filter, setFilter] = useState<string>('all')
  const [selected, setSelected] = useState<ThreatGraphNode | null>(null)
  const [fullscreen, setFullscreen] = useState(false)

  const filtered = useMemo(() => {
    if (filter === 'all') return rawNodes
    return rawNodes.filter((n) => n.type === filter)
  }, [rawNodes, filter])

  const filteredIds = useMemo(() => new Set(filtered.map((n) => n.id)), [filtered])
  const filteredEdges = useMemo(
    () => rawEdges.filter((e) => filteredIds.has(e.source) && filteredIds.has(e.target)),
    [rawEdges, filteredIds],
  )

  const [nodes, setNodes, onNodesChange] = useNodesState(toFlowNodes(filtered))
  const [edges, setEdges, onEdgesChange] = useEdgesState(toFlowEdges(filteredEdges))

  useEffect(() => {
    setNodes(toFlowNodes(filtered))
    setEdges(toFlowEdges(filteredEdges))
  }, [filtered, filteredEdges, setNodes, setEdges])

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const hit = rawNodes.find((n) => n.id === node.id) ?? null
      setSelected(hit)
    },
    [rawNodes],
  )

  const graph = (
    <div className={cn('rounded-xl border border-cyan/30 bg-ink/80', fullscreen ? 'h-[70vh]' : 'h-[420px]')}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#1f2937" gap={20} />
        <Controls className="!bg-panel !border-border" />
        <MiniMap
          nodeColor={(n) => {
            const t = (n.data as { type?: string }).type
            if (t === 'malware') return '#ff1744'
            if (t === 'url') return '#00bcd4'
            return '#9e9e9e'
          }}
          className="!bg-panel2"
        />
      </ReactFlow>
    </div>
  )

  return (
    <Card className={cn('tt-noise', fullscreen && 'fixed inset-4 z-50 overflow-auto')}>
      <CardHeader>
        <CardTitle>Threat Relationship Graph</CardTitle>
        <div className="flex flex-wrap gap-2">
          {['all', 'malware', 'url', 'ip', 'behavior', 'threat_group'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-lg border px-2 py-1 text-xs font-semibold capitalize',
                filter === f ? 'border-cyan/50 text-cyan' : 'border-border/50 text-muted',
              )}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setFullscreen((v) => !v)}>
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => window.alert('Export PNG — use browser screenshot for now.')}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_240px]">
        {graph}
        <div className="rounded-xl border border-border/60 bg-panel2/25 p-3 text-sm">
          <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">Node Details</div>
          {selected ? (
            <div className="mt-2 space-y-1">
              <div className="font-semibold text-text">{selected.label}</div>
              <div className="text-xs text-muted">Type: {selected.type}</div>
              <div className="text-xs text-muted">Scan: {scanId}</div>
            </div>
          ) : (
            <div className="mt-2 text-muted">Click a node to inspect.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
