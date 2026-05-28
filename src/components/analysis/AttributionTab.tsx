import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { RiskGauge } from '../dashboard/RiskGauge'

export function AttributionTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Code Similarity</CardTitle>
          <Badge variant="info">Heuristic</Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted">
            Similarity score across opcode/CFG features.
          </div>
          <RiskGauge value={74} size={92} stroke={10} label="score" />
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Suspected Threat Groups</CardTitle>
          <div className="text-xs text-muted">Confidence</div>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { g: 'FIN7', c: 62 },
            { g: 'UNC2452', c: 44 },
            { g: 'TA505', c: 39 },
          ].map((x) => (
            <div
              key={x.g}
              className="rounded-2xl border border-border/50 bg-panel2/30 px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-text">{x.g}</div>
                <Badge variant={x.c >= 60 ? 'warning' : 'info'}>{x.c}%</Badge>
              </div>
              <div className="mt-2 h-2 rounded-full border border-border/60 bg-panel2/60 p-0.5">
                <div
                  className="h-full rounded-full bg-cyan"
                  style={{
                    width: `${x.c}%`,
                    boxShadow: '0 0 14px rgba(0,188,212,0.25)',
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>Similar Malware Families</CardTitle>
          <div className="text-xs text-muted">Embedding similarity</div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-3">
          {[
            { f: 'RedLine', s: 0.86 },
            { f: 'Lumma', s: 0.73 },
            { f: 'AgentTesla', s: 0.61 },
          ].map((x) => (
            <div
              key={x.f}
              className="rounded-2xl border border-border/50 bg-panel2/30 p-3 hover:border-primary/35 hover:shadow-[0_0_28px_rgba(255,23,68,0.12)] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="font-heading text-sm font-bold text-text">{x.f}</div>
                <Badge variant="info">{Math.round(x.s * 100)}%</Badge>
              </div>
              <div className="mt-2 text-xs text-muted">Similarity score</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>Similar Samples</CardTitle>
          <div className="text-xs text-muted">Top matches</div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-[0.18em] uppercase text-muted">
                <th className="border-b border-border/60 px-3 py-2 text-left">Sample</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Family</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Similarity</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Last seen</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: 'sha256: 9e1f…c2a1', f: 'RedLine', sim: '84%', d: '2026-05-20' },
                { s: 'sha256: a30c…19ff', f: 'Lumma', sim: '72%', d: '2026-05-18' },
                { s: 'sha256: f0a8…0bd4', f: 'AgentTesla', sim: '61%', d: '2026-05-12' },
              ].map((r) => (
                <tr key={r.s} className="odd:bg-panel/25 even:bg-panel2/20">
                  <td className="border-b border-border/30 px-3 py-2 font-heading text-text">
                    {r.s}
                  </td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.f}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.sim}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

