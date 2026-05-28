import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'

export function ThreatIntelTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>VirusTotal</CardTitle>
          <Badge variant="warning">Stub</Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
              Detection ratio
            </div>
            <div className="mt-1 font-semibold text-text">52/72 engines</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
            <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
              Detected as
            </div>
            <div className="mt-1 font-semibold text-text">Trojan.RedLine</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                First seen
              </div>
              <div className="mt-1 text-muted">2026-05-02</div>
            </div>
            <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
              <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-muted">
                Last analysis
              </div>
              <div className="mt-1 text-muted">2026-05-26</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>AbuseIPDB</CardTitle>
          <Badge variant="info">When IPs found</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Enrichment hooks will populate reputation for extracted IPs/domains.
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>MITRE ATT&CK Mapping</CardTitle>
          <div className="text-xs text-muted">Techniques & tactics (stub)</div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {[
              { t: 'T1059', d: 'Command and Scripting Interpreter' },
              { t: 'T1055', d: 'Process Injection' },
              { t: 'T1547', d: 'Boot or Logon Autostart Execution' },
              { t: 'T1071', d: 'Application Layer Protocol' },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-2xl border border-border/50 bg-panel2/30 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="info">{x.t}</Badge>
                  <span className="text-xs text-muted">technique</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-text">{x.d}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/50 bg-panel2/25 p-3">
            <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
              Tactics
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-4">
              {['Execution', 'Persistence', 'Defense Evasion', 'Command & Control'].map(
                (t) => (
                  <div
                    key={t}
                    className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 text-sm text-text"
                  >
                    {t}
                  </div>
                ),
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

