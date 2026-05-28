import { Link } from 'react-router-dom'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { URLScan } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'
import { Badge, classificationBadgeVariant } from '../common/Badge'
import { StatCard } from './StatCard'
import { Link2 } from 'lucide-react'
import { formatTimeAgo, truncateMiddle } from '../../utils/formatters'

export function URLDashboardWidgets({
  recentScans,
  riskDistribution,
  suspiciousCount,
}: {
  recentScans: URLScan[]
  riskDistribution: { name: string; value: number; color: string }[]
  suspiciousCount: number
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <StatCard
          title="Suspicious URLs This Week"
          value={suspiciousCount}
          tone="warning"
          icon={<Link2 className="h-4 w-4" />}
          hint="non-safe classifications"
        />
        <Card className="tt-noise lg:col-span-2">
          <CardHeader>
            <CardTitle>URL Risk Distribution</CardTitle>
            <Link to="/scan-url" className="text-xs text-cyan hover:underline">
              Open scanner
            </Link>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={2}
                >
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,14,39,0.9)',
                    border: '1px solid rgba(0,188,212,0.3)',
                    borderRadius: 12,
                    color: '#e0e0e0',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="tt-noise">
        <CardHeader>
          <CardTitle>Recent URL Scans</CardTitle>
          <Link to="/scan-url" className="text-xs text-cyan hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {recentScans.length === 0 ? (
            <p className="text-sm text-muted">No URL scans yet. Use the URL Scanner to begin.</p>
          ) : (
            <ul className="space-y-2">
              {recentScans.slice(0, 3).map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-panel2/30 px-3 py-2 hover:border-cyan/35 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text" title={s.url}>
                      {truncateMiddle(s.url, 40)}
                    </div>
                    <div className="text-xs text-muted">{formatTimeAgo(s.scannedAt)}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-semibold text-primary">{s.riskScore}%</span>
                    <Badge variant={classificationBadgeVariant(s.classification)}>
                      {s.classification}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
