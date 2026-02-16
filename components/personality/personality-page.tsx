"use client"

import { useState, useCallback } from "react"
import {
  Save,
  RotateCcw,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { PersonalityConfig } from "@/lib/types"
import {
  MOCK_PROGRESS,
  MOCK_ACHIEVEMENTS,
  MOCK_PROFILE,
  type CosmeticSlot,
  type AgentStatus,
} from "@/lib/agent-types"
import { AgentAvatar } from "./agent-avatar"
import { CosmeticsPanel } from "./cosmetics-panel"
import { GrowthPanel } from "./growth-panel"
import { IdentityPanel } from "./identity-panel"

const DEFAULT_CONFIG: PersonalityConfig = {
  key: "professional",
  label: "专业顾问",
  tone: 30,
  replyLength: "medium",
  emojiDensity: "off",
  allowQuestionEnding: false,
}

const STATUS_LABELS: Record<AgentStatus, string> = {
  idle: "待机",
  thinking: "思考中",
  completed: "完成",
  failed: "失败",
  leveling_up: "升级",
}

const STATUS_ORDER: AgentStatus[] = [
  "idle",
  "thinking",
  "completed",
  "failed",
  "leveling_up",
]

export function PersonalityPage() {
  // Personality config
  const [config, setConfig] = useState<PersonalityConfig>({ ...DEFAULT_CONFIG })
  const [isSaved, setIsSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Cultivation state
  const [equipped, setEquipped] = useState<Partial<Record<CosmeticSlot, string>>>({})
  const [activeSlot, setActiveSlot] = useState<CosmeticSlot>("hat")
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("idle")

  const progress = MOCK_PROGRESS
  const achievements = MOCK_ACHIEVEMENTS
  const profile = MOCK_PROFILE

  const updateConfig = useCallback(
    (partial: Partial<PersonalityConfig>) => {
      setConfig((prev) => ({ ...prev, ...partial }))
      setHasChanges(true)
      setIsSaved(false)
    },
    []
  )

  const handleSave = useCallback(() => {
    setIsSaved(true)
    setHasChanges(false)
    setAgentStatus("leveling_up")
    setTimeout(() => {
      setAgentStatus("completed")
      setTimeout(() => setAgentStatus("idle"), 1500)
    }, 1200)
    setTimeout(() => setIsSaved(false), 2500)
  }, [])

  const handleReset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG })
    setEquipped({})
    setHasChanges(false)
    setIsSaved(false)
    setAgentStatus("idle")
  }, [])

  const handleEquip = useCallback(
    (slot: CosmeticSlot, icon: string | undefined) => {
      setEquipped((prev) => {
        const next = { ...prev }
        if (icon === undefined) {
          delete next[slot]
        } else {
          next[slot] = icon
        }
        return next
      })
      setHasChanges(true)
      setIsSaved(false)
    },
    []
  )

  const cycleStatus = useCallback(() => {
    const idx = STATUS_ORDER.indexOf(agentStatus)
    setAgentStatus(STATUS_ORDER[(idx + 1) % STATUS_ORDER.length])
  }, [agentStatus])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
      {/* Status banners */}
      {hasChanges && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5">
          <span className="text-sm text-foreground">
            {"你有未保存的变更"}
          </span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              {"放弃"}
            </Button>
            <Button size="sm" onClick={handleSave}>
              {"保存"}
            </Button>
          </div>
        </div>
      )}
      {isSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5">
          <Check className="h-4 w-4 text-success" />
          <span className="text-sm text-success">
            {"配置已保存，Agent 已更新"}
          </span>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column: Avatar + Cosmetics */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Avatar hero card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                {"Agent 形象"}
              </h3>
              <button
                onClick={cycleStatus}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted"
                aria-label="切换状态预览"
              >
                <span
                  className={cn(
                    "mr-1 inline-block h-1.5 w-1.5 rounded-full",
                    agentStatus === "idle" && "bg-muted-foreground/40",
                    agentStatus === "thinking" && "bg-primary animate-pulse",
                    agentStatus === "completed" && "bg-success",
                    agentStatus === "failed" && "bg-destructive",
                    agentStatus === "leveling_up" && "bg-warning animate-pulse"
                  )}
                />
                <span>{STATUS_LABELS[agentStatus]}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* Avatar preview area */}
            <div className="relative mx-auto mb-6 flex items-center justify-center rounded-2xl bg-muted/40 py-8">
              {/* Decorative dots */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, currentColor 1px, transparent 1px)",
                  backgroundSize: "16px 16px",
                }}
                aria-hidden="true"
              />
              <AgentAvatar
                equipped={equipped}
                status={agentStatus}
                size="lg"
              />
            </div>

            {/* Name & level */}
            <div className="text-center">
              <p className="text-base font-semibold text-card-foreground">
                {profile.name}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {profile.bio}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  {"Lv." + progress.level}
                </Badge>
                <span className="text-[10px] text-muted-foreground">
                  {progress.xp + " / " + progress.xpToNext + " XP"}
                </span>
              </div>
            </div>
          </div>

          {/* Cosmetics panel */}
          <CosmeticsPanel
            level={progress.level}
            activeSlot={activeSlot}
            onSlotChange={setActiveSlot}
            equipped={equipped}
            onEquip={handleEquip}
          />
        </div>

        {/* Right column: Tabs for Identity / Growth */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="identity" className="flex-1">
                {"身份 & 人格"}
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex-1">
                {"成长 & 成就"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="identity">
              <IdentityPanel config={config} onUpdate={updateConfig} />
            </TabsContent>

            <TabsContent value="growth">
              <GrowthPanel
                progress={progress}
                achievements={achievements}
              />
            </TabsContent>
          </Tabs>

          {/* Bottom actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
              {"恢复默认"}
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              {"保存配置"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
