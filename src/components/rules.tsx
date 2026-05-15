"use client";

import { gameRules } from "@/config/rules";
import { cn } from "@/utils/cn";

interface RulesProps {
  className?: string;
}

export function Rules({ className }: RulesProps) {
  return (
    <ol className={cn("space-y-3.5", className)}>
      {gameRules.map((rule, index) => (
        <li key={rule.title} className="flex items-start gap-3">
          <span
            className="tabular mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-border bg-muted/40 text-muted-foreground text-xs font-medium"
            aria-hidden="true"
          >
            {index + 1}
          </span>
          <div className="space-y-0.5 leading-snug">
            <p className="text-sm font-medium text-foreground">{rule.title}</p>
            <p className="text-sm text-muted-foreground">{rule.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
