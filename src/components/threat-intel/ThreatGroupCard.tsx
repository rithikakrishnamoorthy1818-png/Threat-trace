import { motion } from 'framer-motion'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

export function ThreatGroupCard({
  name,
  region,
  families,
  lastActivity,
}: {
  name: string
  region: string
  families: number
  lastActivity: string
}) {
  return (
    <motion.div
      className={cn(
        'tt-noise rounded-2xl border border-border/60 bg-panel/55 p-4 transition-all duration-300',
        'hover:border-cyan/40 hover:shadow-[0_0_34px_rgba(0,188,212,0.14)]',
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-heading text-sm font-bold tracking-wide text-text">
            {name}
          </div>
          <div className="mt-1 text-sm text-muted">Region: {region}</div>
        </div>
        <Badge variant="info">{families} families</Badge>
      </div>
      <div className="mt-3 text-xs text-muted">Last activity: {lastActivity}</div>
    </motion.div>
  )
}

