import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MalwareFamilyStat } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'

export function TopFamiliesChart({ data }: { data: MalwareFamilyStat[] }) {
  return (
    <Card className="tt-noise">
      <CardHeader>
        <CardTitle>Top Malware Families</CardTitle>
        <div className="text-xs text-muted">Last 30 days</div>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 6 }}>
            <CartesianGrid stroke="rgba(0,188,212,0.10)" strokeDasharray="3 3" />
            <XAxis
              type="number"
              tick={{ fill: 'rgba(224,224,224,0.65)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(0,188,212,0.18)' }}
            />
            <YAxis
              type="category"
              dataKey="family"
              width={90}
              tick={{ fill: 'rgba(224,224,224,0.65)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(0,188,212,0.18)' }}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,14,39,0.85)',
                border: '1px solid rgba(0,188,212,0.3)',
                borderRadius: 12,
                color: 'rgba(224,224,224,0.92)',
              }}
              labelStyle={{ color: 'rgba(224,224,224,0.8)' }}
            />
            <Bar
              dataKey="count"
              fill="var(--tt-cyan)"
              radius={[10, 10, 10, 10]}
              style={{
                filter: 'drop-shadow(0 0 12px rgba(0,188,212,0.25))',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

