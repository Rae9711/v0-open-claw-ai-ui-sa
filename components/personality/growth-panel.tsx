"use client"

import {
  Flame,
  Zap,
  MessageSquare,
  CheckCircle2,
  Trophy,
  Lock,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { AgentProgress, Achievement } from "@/lib/agent-types"

interface GrowthPanelProps {
  progress: AgentProgress
  achievements: Achievement[]
}

export function GrowthPanel({ progress, achievements }: GrowthPanelProps) {
  const xpPercent = Math.round((progress.xp / progress.xpToNext) * 100)

  return (
    <div className="flex flex-col gap-5">
      {/* Level & XP */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-card-foreground">
            成长进度
          </h3>
          <Badge variant="secondary" className="gap-1 text-xs">
            <Zap className="h-3 w-3" />
            {"Lv." + progress.level}
          </Badge>
        </div>

        {/* XP Bar */}
        <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
          <span>经验值</span>
          <span className="tabular-nums">
            {progress.xp} / {progress.xpToNext} XP
          </span>
        </div>
        <Progress value={xpPercent} className="mb-5 h-2.5" />

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
            <Flame className="h-4 w-4 text-warning" />
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {progress.streakDays}
            </span>
            <span className="text-[10px] text-muted-foreground">连续天数</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {progress.totalTasks}
            </span>
            <span className="text-[10px] text-muted-foreground">完成任务</span>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-lg bg-muted/50 p-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold tabular-nums text-card-foreground">
              {progress.totalMessages}
            </span>
            <span className="text-[10px] text-muted-foreground">对话次数</span>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-xl border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            成就徽章
          </h3>
          <span className="text-xs text-muted-foreground">
            {achievements.filter((a) => a.completed).length}/{achievements.length}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={cn(
                "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                ach.completed
                  ? "border-success/20 bg-success/5"
                  : "border-border"
              )}
            >
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base",
                  ach.completed ? "bg-success/10" : "bg-muted"
                )}
              >
                {ach.completed ? (
                  <span>{ach.icon}</span>
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      ach.completed
                        ? "text-card-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {ach.title}
                  </span>
                  {ach.completed && (
                    <Trophy className="h-3.5 w-3.5 text-success" />
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {ach.description}
                </span>
                {!ach.completed && (
                  <Progress value={ach.progress} className="h-1.5" />
                )}
                {ach.rewardLabel && (
                  <span className="text-[10px] text-primary">
                    {"奖励: " + ach.rewardLabel}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
