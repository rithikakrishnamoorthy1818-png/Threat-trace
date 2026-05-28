import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold tracking-tight transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-ink'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-ink border border-primary/70 shadow-[var(--tt-shadow-red)] hover:shadow-[0_0_38px_rgba(255,23,68,0.55)] hover:brightness-110 active:translate-y-px',
  secondary:
    'bg-transparent text-text border border-cyan/60 shadow-[var(--tt-shadow-cyan)] hover:bg-cyan/15 hover:border-cyan hover:shadow-[0_0_38px_rgba(0,188,212,0.45)] active:translate-y-px',
  ghost:
    'bg-transparent text-text border border-border hover:border-cyan/60 hover:bg-panel2/70 hover:shadow-[0_0_26px_rgba(0,188,212,0.18)] active:translate-y-px',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', type, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type ?? 'button'}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
})

