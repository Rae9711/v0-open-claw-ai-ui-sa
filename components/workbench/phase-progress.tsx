"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TaskPhase } from "@/lib/types"
import { PHASE_LABELS } from "@/lib/types"

const ORDERED_PHASES: TaskPhase[] = [
  "input",
  "planning",
  "approval",
  "executing",
  "completed",
]

function phaseIndex(phase: TaskPhase): number {
  if (phase === "failed") return -1
  return ORDERED_PHASES.indexOf(phase)
}

interface PhaseProgressProps {
  currentPhase: TaskPhase
}

export function PhaseProgress({ currentPhase }: PhaseProgressProps) {
  const current = phaseIndex(currentPhase)
  const isFailed = currentPhase === "failed"

  return (
    <div className="w-full" role="progressbar" aria-label="任务阶段进度">
      {/* Desktop: horizontal */}
      <div className="hidden items-center justify-between md:flex">
        {ORDERED_PHASES.map((phase, i) => {
          const isActive = i === current
          const isDone = current > i
          const label = PHASE_LABELS[phase]

          return (
            <div key={phase} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isDone
                      ? "bg-primary text-primary-foreground"
                      : isActive && !isFailed
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : isFailed && i === 0
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-secondary text-muted-foreground"
                  )}
                >
                  {isDone ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    isActive || isDone
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < ORDERED_PHASES.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1",
                    isDone ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: compact */}
      <div className="flex items-center gap-2 md:hidden">
        {ORDERED_PHASES.map((phase, i) => {
          const isActive = i === current
          const isDone = current > i
          return (
            <div key={phase} className="flex flex-1 flex-col items-center gap-1">
              <div
                className={cn(
                  "h-2 w-full rounded-full transition-all",
                  isDone
                    ? "bg-primary"
                    : isActive && !isFailed
                      ? "bg-primary/60"
                      : isFailed && i === 0
                        ? "bg-destructive"
                        : "bg-border"
                )}
              />
              <span
                className={cn(
                  "text-[10px]",
                  isActive || isDone
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {PHASE_LABELS[phase]}
              </span>
            </div>
          )
        })}
      </div>

      {isFailed && (
        <p className="mt-2 text-center text-sm font-medium text-destructive">
          任务执行失败
        </p>
      )}
    </div>
  )
}
