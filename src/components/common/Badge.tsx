import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export type BadgeVariant =
  | 'critical'
  | 'safe'
  | 'pending'
  | 'info'
  | 'warning'
  | 'malicious'
  | 'suspicious'
  | 'phishing'

const styles: Record<BadgeVariant, string> = {
  critical:
    'border-primary/70 text-primary shadow-[0_0_18px_rgba(255,23,68,0.28)]',
  safe: 'border-success/70 text-success shadow-[0_0_18px_rgba(0,255,65,0.22)]',
  pending:
    'border-warning/70 text-warning shadow-[0_0_18px_rgba(255,145,0,0.22)]',
  info: 'border-cyan/70 text-cyan shadow-[0_0_18px_rgba(0,188,212,0.22)]',
  warning:
    'border-warning/70 text-warning shadow-[0_0_18px_rgba(255,145,0,0.22)]',
  malicious:
    'border-primary/70 text-primary shadow-[0_0_18px_rgba(255,23,68,0.28)]',
  suspicious:
    'border-warning/70 text-warning shadow-[0_0_18px_rgba(255,145,0,0.22)]',
  phishing:
    'border-[#b388ff]/70 text-[#b388ff] shadow-[0_0_18px_rgba(179,136,255,0.22)]',
}

export function classificationBadgeVariant(
  c: 'safe' | 'suspicious' | 'malicious' | 'phishing',
): BadgeVariant {
  if (c === 'safe') return 'safe'
  if (c === 'suspicious') return 'suspicious'
  if (c === 'phishing') return 'phishing'
  return 'malicious'
}

export function Badge({
  variant = 'info',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border bg-ink/20 px-2.5 py-1 text-xs font-semibold tracking-wide',
        styles[variant],
        className,
      )}
      {...props}
    />
  )
}

