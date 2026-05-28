import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { SearchBar } from './SearchBar'
import { MalwareFamilyCard } from './MalwareFamilyCard'
import { ThreatGroupCard } from './ThreatGroupCard'
import { useNotification } from '../../hooks/useNotification'

const DATA = [
  { malware: 'RedLine Stealer', group: 'FIN7', samples: 182, lastSeen: '2026-05-24', risk: 92 },
  { malware: 'AsyncRAT', group: 'TA505', samples: 96, lastSeen: '2026-05-21', risk: 71 },
  { malware: 'QakBot', group: 'UNC2452', samples: 74, lastSeen: '2026-05-19', risk: 88 },
  { malware: 'AgentTesla', group: 'TA505', samples: 120, lastSeen: '2026-05-25', risk: 64 },
  { malware: 'Lumma', group: 'FIN7', samples: 51, lastSeen: '2026-05-18', risk: 58 },
]

export function ThreatIntelligence() {
  const notify = useNotification()
  const [q, setQ] = useState('')
  const [family, setFamily] = useState('All')
  const [group, setGroup] = useState('All')
  const [risk, setRisk] = useState(0)

  const families = useMemo(() => ['All', ...new Set(DATA.map((d) => d.malware))], [])
  const groups = useMemo(() => ['All', ...new Set(DATA.map((d) => d.group))], [])

  const rows = useMemo(() => {
    return DATA.filter((d) => {
      const matchesQ =
        !q ||
        d.malware.toLowerCase().includes(q.toLowerCase()) ||
        d.group.toLowerCase().includes(q.toLowerCase())
      const matchesFamily = family === 'All' || d.malware === family
      const matchesGroup = group === 'All' || d.group === group
      const matchesRisk = d.risk >= risk
      return matchesQ && matchesFamily && matchesGroup && matchesRisk
    })
  }, [q, family, group, risk])

  return (
    <div className="space-y-4">
      <SearchBar value={q} onChange={setQ} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {rows.map((d) => (
            <MalwareFamilyCard
              key={d.malware}
              name={d.malware}
              group={d.group}
              samples={d.samples}
              lastSeen={d.lastSeen}
              onOpen={() =>
                notify.info('Detailed view stub', 'Click-through will route later.')
              }
            />
          ))}
          {rows.length === 0 ? (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>No Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted">
                Adjust your search/filter parameters.
              </CardContent>
            </Card>
          ) : null}
        </div>

        <Card className="tt-noise">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <div className="text-xs text-muted">Refine threat intel</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                Malware family
              </div>
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text focus:border-cyan/70 focus:ring-cyan/40"
              >
                {families.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                Threat group
              </div>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full rounded-xl border-border/60 bg-panel2/70 px-3 py-2 text-sm text-text focus:border-cyan/70 focus:ring-cyan/40"
              >
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold tracking-[0.2em] uppercase text-muted">
                <span>Risk level</span>
                <span className="text-text/80">{risk}+</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={risk}
                onChange={(e) => setRisk(Number(e.target.value))}
                className="w-full accent-cyan"
                aria-label="Risk level slider"
              />
            </div>

            <div className="pt-2">
              <div className="text-xs font-bold tracking-[0.2em] uppercase text-muted">
                Threat groups (sample)
              </div>
              <div className="mt-2 space-y-2">
                <ThreatGroupCard name="FIN7" region="Unknown" families={12} lastActivity="2026-05-25" />
                <ThreatGroupCard name="TA505" region="Unknown" families={9} lastActivity="2026-05-23" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

