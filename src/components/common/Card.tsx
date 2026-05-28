import { type HTMLAttributes } from 'react'
import { cn } from '../../utils/cn'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border/70 bg-panel/70 backdrop-blur supports-[backdrop-filter]:bg-panel/60 shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-300',
        'hover:border-cyan/55 hover:shadow-[0_0_34px_rgba(0,188,212,0.14)]',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-border/50 px-5 py-4',
        className,
      )}
      {...props}
    />
  )
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        'font-heading text-sm sm:text-base font-bold tracking-[0.06em] uppercase text-text',
        className,
      )}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('px-5 py-4', className)} {...props} />
}

