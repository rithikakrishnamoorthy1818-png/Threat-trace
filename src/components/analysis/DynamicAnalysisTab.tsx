import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'

const LOG = `
[00:00.000] sandbox: VM booted
[00:00.422] sample: spawned PID 2412
[00:00.901] api: VirtualAlloc -> 0x000001E9A0000000
[00:01.112] api: WriteProcessMemory -> size=4096
[00:01.410] api: CreateRemoteThread -> PID 980
[00:02.201] net: DNS query -> cdn-update.site
[00:02.834] net: TCP connect -> 185.199.110.153:443
[00:03.611] reg: HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\UpdateSvc
[00:04.095] file: wrote C:\\Users\\Public\\svchost.exe
[00:05.220] proc: child PID 3096 -> svchost.exe
`.trim()

export function DynamicAnalysisTab() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>Behavior Log</CardTitle>
          <Badge variant="warning">Sandbox</Badge>
        </CardHeader>
        <CardContent>
          <div className="tt-terminal max-h-[260px] overflow-auto whitespace-pre text-sm text-text">
            {LOG}
          </div>
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>API Calls Detected</CardTitle>
          <div className="text-xs text-muted">Filtering (stub)</div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-[0.18em] uppercase text-muted">
                <th className="border-b border-border/60 px-3 py-2 text-left">API</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Count</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {[
                { api: 'VirtualAlloc', c: 12, cat: 'Memory' },
                { api: 'CreateRemoteThread', c: 3, cat: 'Injection' },
                { api: 'RegSetValueExW', c: 2, cat: 'Persistence' },
                { api: 'HttpSendRequestW', c: 7, cat: 'Network' },
              ].map((r) => (
                <tr key={r.api} className="odd:bg-panel/25 even:bg-panel2/20">
                  <td className="border-b border-border/30 px-3 py-2 font-semibold text-text">
                    {r.api}
                  </td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.c}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.cat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Network Connections</CardTitle>
          <div className="text-xs text-muted">IPs extracted</div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-[0.18em] uppercase text-muted">
                <th className="border-b border-border/60 px-3 py-2 text-left">Remote</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Port</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Proto</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ip: '185.199.110.153', p: 443, pr: 'TCP' },
                { ip: '104.21.19.74', p: 80, pr: 'TCP' },
              ].map((r) => (
                <tr key={r.ip} className="odd:bg-panel/25 even:bg-panel2/20">
                  <td className="border-b border-border/30 px-3 py-2 font-semibold text-text">
                    {r.ip}
                  </td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.p}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{r.pr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Registry Modifications</CardTitle>
          <div className="text-xs text-muted">Tree view (stub)</div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
            <div className="text-muted">HKCU</div>
            <div className="mt-1 pl-3 text-text">
              Software\Microsoft\Windows\CurrentVersion\Run
              <div className="mt-1 pl-3 text-muted">UpdateSvc = "svchost.exe"</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Process Tree</CardTitle>
          <div className="text-xs text-muted">Hierarchical view (stub)</div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2">
            <div className="font-semibold text-text">invoice_0426.exe (PID 2412)</div>
            <div className="mt-1 pl-3 text-muted">
              └─ svchost.exe (PID 3096)
              <div className="pl-3">└─ rundll32.exe (PID 3221)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

