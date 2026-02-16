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
  FORM_UNLOCK_LEVELS,
  FORM_LABELS,
  MOCK_PROGRESS,
  MOCK_ACHIEVEMENTS,
  type BaseForm,
  type CosmeticSlot,
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

const BASE_FORMS: BaseForm[] = ["fire", "robot", "cat", "pixel"]

export function PersonalityPage() {
  // Personality config
  const [config, setConfig] = useState<PersonalityConfig>({ ...DEFAULT_CONFIG })
  const [isSaved, setIsSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Cultivation state
  const [baseForm, setBaseForm] = useState<BaseForm>("robot")
  const [equipped, setEquipped] = useState<Partial<Record<CosmeticSlot, string>>>({})
  const [activeSlot, setActiveSlot] = useState<CosmeticSlot>("hat")
  const [agentStatus, setAgentStatus] = useState<"idle" | "thinking" | "completed" | "failed" | "leveling_up">("idle")

  // Status demo cycling
  const [statusDemo, setStatusDemo] = useState(false)

  const progress = MOCK_PROGRESS
  const achievements = MOCK_ACHIEVEMENTS

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
    // Flash level-up animation
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
    setBaseForm("robot")
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
    const statuses: Array<"idle" | "thinking" | "completed" | "failed" | "leveling_up"> = [
      "idle",
      "thinking",
      "completed",
      "failed",
      "leveling_up",
    ]
    const current = statuses.indexOf(agentStatus)
    setAgentStatus(statuses[(current + 1) % statuses.length])
  }, [agentStatus])

  const STATUS_LABELS: Record<string, string> = {
    idle: "待机",
    thinking: "思考中",
    completed: "完成",
    failed: "失败",
    leveling_up: "升级",
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
      {/* Status banners */}
      {hasChanges && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5">
          <span className="text-sm text-foreground">你有未保存的变更</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              放弃
            </Button>
            <Button size="sm" onClick={handleSave}>
              保存
            </Button>
          </div>
        </div>
      )}
      {isSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5">
          <Check className="h-4 w-4 text-success" />
          <span className="text-sm text-success">
            配置已保存，Agent 已更新
          </span>
        </div>
      )}

      {/* Main 2-column layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column: Avatar preview + Form selector + Cosmetics */}
        <div className="flex flex-col gap-6 lg:col-span-5">
          {/* Avatar hero card */}
          <div className="rounded-xl border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-card-foreground">
                Agent 形象
              </h3>
              <button
                onClick={cycleStatus}
                className="flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] text-muted-foreground transition-colors hover:bg-muted"
              >
                <span className="text-muted-foreground">
                  {STATUS_LABELS[agentStatus]}
                </span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>

            {/* Avatar preview area */}
            <div className="relative mx-auto mb-6 flex items-center justify-center rounded-2xl bg-muted/40 py-10">
              {/* Decorative grid dots */}
              <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                backgroundSize: "16px 16px",
              }} />
              <AgentAvatar
                baseForm={baseForm}
                equipped={equipped}
                status={agentStatus}
                size="lg"
              />
            </div>

            {/* Name & level */}
            <div className="mb-5 text-center">
              <p className="text-base font-semibold text-card-foreground">
                {"OpenClaw Agent"}
              </p>
              <div className="mt-1 flex items-center justify-center gap-2">
                <Badge variant="secondary" className="gap-1 text-[10px]">
                  <Sparkles className="h-3 w-3" />
                  {"Lv." + progress.level}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {FORM_LABELS[baseForm]}
                </span>
              </div>
            </div>

            {/* Base form selector */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                基础形态
              </p>
              <div className="grid grid-cols-4 gap-2">
                {BASE_FORMS.map((form) => {
                  const locked = FORM_UNLOCK_LEVELS[form] > progress.level
                  return (
                    <button
                      key={form}
                      onClick={() => {
                        if (!locked) {
                          setBaseForm(form)
                          setHasChanges(true)
                        }
                      }}
                      disabled={locked}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-colors",
                        locked
                          ? "cursor-not-allowed opacity-40"
                          : baseForm === form
                            ? "border-primary bg-primary/5"
                            : "hover:bg-muted"
                      )}
                    >
                      <div className="flex h-8 w-8 items-center justify-center">
                        <AgentAvatar
                          baseForm={form}
                          equipped={{}}
                          status="idle"
                          size="sm"
                        />
                      </div>
                      <span className="text-[10px] font-medium text-card-foreground">
                        {FORM_LABELS[form]}
                      </span>
                      {locked && (
                        <span className="text-[9px] text-muted-foreground">
                          {"Lv." + FORM_UNLOCK_LEVELS[form]}
                        </span>
                      )}
                    </button>
                  )
                })}
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
                身份 & 人格
              </TabsTrigger>
              <TabsTrigger value="growth" className="flex-1">
                成长 & 成就
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
              恢复默认
            </Button>
            <Button className="flex-1 gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              保存配置
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
