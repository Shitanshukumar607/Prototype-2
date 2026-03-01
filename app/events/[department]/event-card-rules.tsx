"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface EventCardRulesProps {
  rules: string[] | string
}

function getPoints(rules: string[] | string): string[] {
  return Array.isArray(rules)
    ? rules
    : rules.split(/\.\s+/).map((s) => s.trim()).filter(Boolean)
}

function RulesList({ points }: { points: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-1 text-white/60 leading-relaxed">
      {points.map((point, i) => (
        <li key={i}>{point}{point.endsWith(".") ? "" : "."}</li>
      ))}
    </ul>
  )
}

export function EventCardRules({ rules }: EventCardRulesProps) {
  const points = getPoints(rules)
  const [open, setOpen] = useState(false)

  return (
    <div>
      <h4 className="text-white/90 font-medium mb-1.5">Rules</h4>
      {/* Mobile: collapsible */}
      <div className="md:hidden">
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
            <span>{open ? "Hide rules" : "Show rules"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="pt-2">
              <RulesList points={points} />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      {/* Desktop: always visible */}
      <div className="hidden md:block">
        <RulesList points={points} />
      </div>
    </div>
  )
}
