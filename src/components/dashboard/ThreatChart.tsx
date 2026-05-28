import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TimelinePoint } from '../../types'
import { Card, CardContent, CardHeader, CardTitle } from '../common/Card'

export function ThreatChart({ data }: { data: TimelinePoint[] }) {
  return (
    <Card className="tt-noise">
      <CardHeader>
        <CardTitle>Threat Timeline (30 days)</CardTitle>
        <div className="text-xs text-muted">Detections per day</div>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(0,188,212,0.10)" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(224,224,224,0.65)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(0,188,212,0.18)' }}
              interval="preserveStartEnd"
            />
            <YAxis
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
            <Line
              type="monotone"
              dataKey="threats"
              stroke="var(--tt-primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{
                r: 4,
                stroke: 'var(--tt-cyan)',
                strokeWidth: 2,
                fill: 'var(--tt-primary)',
              }}
              style={{
                filter: 'drop-shadow(0 0 12px rgba(255,23,68,0.35))',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

