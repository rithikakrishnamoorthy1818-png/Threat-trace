import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge } from '../common/Badge'
import { RiskGauge } from '../dashboard/RiskGauge'

const STRINGS = [
  'cmd.exe /c powershell -EncodedCommand ...',
  'hxxp://cdn-update[.]site/payload',
  'Software\\Microsoft\\Windows\\CurrentVersion\\Run',
  'CreateRemoteThread',
  'VirtualAlloc',
  'GetProcAddress',
  'LoadLibraryA',
]

const IMPORTS = [
  'kernel32.dll: CreateFileW, WriteFile, VirtualAlloc, CreateRemoteThread',
  'advapi32.dll: RegSetValueExW, RegCreateKeyExW',
  'wininet.dll: InternetOpenW, InternetConnectW, HttpSendRequestW',
]

export function StaticAnalysisTab() {
  const [q, setQ] = useState('')
  const strings = useMemo(
    () => STRINGS.filter((s) => s.toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>File Entropy</CardTitle>
          <Badge variant="info">0–8</Badge>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted">
            High entropy can indicate packing/encryption.
          </div>
          <RiskGauge value={86} size={92} stroke={10} label="7.1" />
        </CardContent>
      </Card>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Is Packed?</CardTitle>
          <Badge variant="warning">Likely</Badge>
        </CardHeader>
        <CardContent className="text-sm text-muted">
          Heuristics indicate compressed sections and opaque imports.
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <div>
            <CardTitle>Suspicious Strings</CardTitle>
            <div className="mt-1 text-xs text-muted">
              Searchable extracted strings
            </div>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search strings…"
            className="h-10 w-56 rounded-xl border-border/60 bg-panel2/70 px-3 text-sm text-text placeholder:text-muted/60 focus:border-cyan/70 focus:ring-cyan/40"
            aria-label="Search suspicious strings"
          />
        </CardHeader>
        <CardContent>
          <div className="tt-terminal max-h-[240px] overflow-auto text-sm text-text">
            {strings.map((s, i) => (
              <div key={i} className="whitespace-pre-wrap break-words">
                <span className="text-muted">{String(i + 1).padStart(2, '0')}</span>{' '}
                {s}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>Imported Functions</CardTitle>
          <div className="text-xs text-muted">Collapsible list (stub)</div>
        </CardHeader>
        <CardContent className="space-y-2">
          {IMPORTS.map((i) => (
            <details
              key={i}
              className="rounded-xl border border-border/50 bg-panel2/30 px-3 py-2"
            >
              <summary className="cursor-pointer text-sm font-semibold text-text">
                {i.split(':')[0]}
              </summary>
              <div className="mt-2 text-sm text-muted">{i.split(':')[1]}</div>
            </details>
          ))}
        </CardContent>
      </Card>

      <Card className="tt-noise lg:col-span-2">
        <CardHeader>
          <CardTitle>File Sections</CardTitle>
          <div className="text-xs text-muted">PE/ELF view (stub)</div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="text-xs font-bold tracking-[0.18em] uppercase text-muted">
                <th className="border-b border-border/60 px-3 py-2 text-left">Section</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Virtual</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Raw</th>
                <th className="border-b border-border/60 px-3 py-2 text-left">Entropy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: '.text', v: '0x1000', r: '0x0400', e: '6.2' },
                { n: '.rdata', v: '0xA000', r: '0x2C00', e: '5.1' },
                { n: '.data', v: '0xE000', r: '0x4A00', e: '3.0' },
                { n: '.x', v: '0xF000', r: '0x5200', e: '7.6' },
              ].map((s) => (
                <tr key={s.n} className="odd:bg-panel/25 even:bg-panel2/20">
                  <td className="border-b border-border/30 px-3 py-2 font-semibold text-text">
                    {s.n}
                  </td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{s.v}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{s.r}</td>
                  <td className="border-b border-border/30 px-3 py-2 text-muted">{s.e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

