import type { ReactNode } from "react"
import { cn } from "@/utils/cn"

interface SectionProps {
  label?: string
  children: ReactNode
  className?: string
}

export function Section({ label, children, className }: SectionProps) {
  return (
    <section className={cn("mb-10 last:mb-0 lg:mb-8", className)}>
      {label ? <h2 className="section-label mb-3">{label}</h2> : null}
      {children}
    </section>
  )
}
