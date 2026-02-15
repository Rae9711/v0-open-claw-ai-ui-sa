"use client"

import { useState, useCallback } from "react"
import {
  Bot,
  Upload,
  Sparkles,
  Loader2,
  Save,
  RotateCcw,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { PersonalityKey, PersonalityConfig } from "@/lib/types"
import { PERSONALITY_MAP } from "@/lib/types"

const ICON_STYLES = [
  { key: "minimal", label: "极简" },
  { key: "tech", label: "科技" },
  { key: "cute", label: "可爱" },
  { key: "business", label: "商务" },
]

const REPLY_LENGTHS = [
  { key: "short", label: "简短" },
  { key: "medium", label: "适中" },
  { key: "long", label: "详细" },
] as const

const EMOJI_DENSITIES = [
  { key: "off", label: "关闭" },
  { key: "low", label: "偶尔" },
  { key: "medium", label: "适量" },
] as const

const DEFAULT_CONFIG: PersonalityConfig = {
  key: "professional",
  label: "专业顾问",
  tone: 30,
  replyLength: "medium",
  emojiDensity: "off",
  allowQuestionEnding: false,
}

const PREVIEW_REPLIES: Record<PersonalityKey, string> = {
  professional:
    "根据您提供的需求，我已完成活动邀请函的撰写。正文围绕三个核心要点展开：活动价值、议程亮点和参与方式。建议您确认后安排发送。",
  friendly_coach:
    "邀请函写好啦！我把重点放在了活动对大家成长的帮助上，读起来应该蛮温馨的。你看看哪里需要调整，我再帮你改。",
  no_bs:
    "邀请函已生成。328字，含时间地点议程。确认就发。",
  playful_nerd:
    "叮！你的超级邀请函已出炉～我用了最新的 NLP 模型优化了措辞，信息密度拉满的同时保持了可读性。要不要看看？",
}

export function PersonalityPage() {
  const [config, setConfig] = useState<PersonalityConfig>({ ...DEFAULT_CONFIG })
  const [iconStyle, setIconStyle] = useState("tech")
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [testInput, setTestInput] = useState("帮我写一封活动邀请函")

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
    setTimeout(() => setIsSaved(false), 2000)
  }, [])

  const handleReset = useCallback(() => {
    setConfig({ ...DEFAULT_CONFIG })
    setIconStyle("tech")
    setHasChanges(false)
    setIsSaved(false)
  }, [])

  const handleGenerateAvatar = useCallback(() => {
    setIsGeneratingAvatar(true)
    setTimeout(() => setIsGeneratingAvatar(false), 2000)
  }, [])

  const activePersonality = config.key as PersonalityKey
  const previewReply =
    config.key === "custom"
      ? PREVIEW_REPLIES.professional
      : PREVIEW_REPLIES[activePersonality]

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-warning/30 bg-warning/5 px-4 py-2.5">
          <span className="text-sm text-foreground">
            你有未保存的变更
          </span>
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

      {/* Saved Confirmation */}
      {isSaved && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5">
          <Check className="h-4 w-4 text-success" />
          <span className="text-sm text-success">配置已保存，工作台已更新</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left: Avatar & Icon Style */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Avatar Section */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">
              助手形象
            </h3>

            {/* Preview Card */}
            <div className="mb-5 flex flex-col items-center gap-3 rounded-lg bg-muted/50 p-6">
              <div
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-xl",
                  iconStyle === "minimal" && "bg-foreground/10",
                  iconStyle === "tech" && "bg-primary/10",
                  iconStyle === "cute" && "bg-pink-100",
                  iconStyle === "business" && "bg-secondary"
                )}
              >
                <Bot
                  className={cn(
                    "h-10 w-10",
                    iconStyle === "minimal" && "text-foreground",
                    iconStyle === "tech" && "text-primary",
                    iconStyle === "cute" && "text-pink-500",
                    iconStyle === "business" && "text-secondary-foreground"
                  )}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-card-foreground">
                  OpenClaw 助手
                </p>
                <p className="text-xs text-muted-foreground">
                  {config.key === "custom"
                    ? "自定义人格"
                    : PERSONALITY_MAP[activePersonality]?.description}
                </p>
              </div>
            </div>

            {/* Upload & Generate */}
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full gap-2">
                <Upload className="h-4 w-4" />
                上传头像
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleGenerateAvatar}
                disabled={isGeneratingAvatar}
              >
                {isGeneratingAvatar ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    AI 生成头像
                  </>
                )}
              </Button>
            </div>

            {/* Icon Style */}
            <div className="mt-5">
              <Label className="mb-2 block text-xs text-muted-foreground">
                图标风格
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {ICON_STYLES.map((style) => (
                  <button
                    key={style.key}
                    onClick={() => {
                      setIconStyle(style.key)
                      setHasChanges(true)
                    }}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-xs font-medium transition-colors",
                      iconStyle === style.key
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Personality Configuration */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Default Personality Picker */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold text-card-foreground">
              默认人格
            </h3>
            <RadioGroup
              value={config.key}
              onValueChange={(val) =>
                updateConfig({
                  key: val as PersonalityKey,
                  label:
                    PERSONALITY_MAP[val as PersonalityKey]?.label ??
                    "自定义",
                })
              }
              className="grid grid-cols-1 gap-2 sm:grid-cols-2"
            >
              {(
                Object.entries(PERSONALITY_MAP) as [
                  PersonalityKey,
                  { label: string; description: string },
                ][]
              ).map(([key, { label, description }]) => (
                <label
                  key={key}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-colors",
                    config.key === key
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  )}
                >
                  <RadioGroupItem value={key} className="mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-card-foreground">
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {description}
                    </span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Advanced: Custom Settings */}
          <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-card-foreground">
                高级调参
              </h3>
              <Badge variant="secondary" className="text-[10px]">
                增强层
              </Badge>
            </div>

            <div className="flex flex-col gap-5">
              {/* Tone Slider */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">
                    语气风格
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {config.tone <= 33
                      ? "严谨"
                      : config.tone <= 66
                        ? "平衡"
                        : "亲和"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">
                    严谨
                  </span>
                  <Slider
                    value={[config.tone]}
                    onValueChange={([v]) => updateConfig({ tone: v })}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    亲和
                  </span>
                </div>
              </div>

              {/* Reply Length */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  回复长度
                </Label>
                <div className="flex gap-2">
                  {REPLY_LENGTHS.map((rl) => (
                    <button
                      key={rl.key}
                      onClick={() => updateConfig({ replyLength: rl.key })}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        config.replyLength === rl.key
                          ? "border-primary bg-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {rl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Emoji Density */}
              <div>
                <Label className="mb-2 block text-xs text-muted-foreground">
                  表情密度
                </Label>
                <div className="flex gap-2">
                  {EMOJI_DENSITIES.map((ed) => (
                    <button
                      key={ed.key}
                      onClick={() => updateConfig({ emojiDensity: ed.key })}
                      className={cn(
                        "flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                        config.emojiDensity === ed.key
                          ? "border-primary bg-primary/5 text-primary"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {ed.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Ending Switch */}
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">
                    提问收尾
                  </span>
                  <span className="text-xs text-muted-foreground">
                    回复末尾追加引导性提问
                  </span>
                </div>
                <Switch
                  checked={config.allowQuestionEnding}
                  onCheckedChange={(v) =>
                    updateConfig({ allowQuestionEnding: v })
                  }
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold text-card-foreground">
              效果预览
            </h3>
            <div className="mb-3">
              <Textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="输入测试指令..."
                className="min-h-10 resize-none text-sm"
                rows={1}
              />
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">
                  {config.key === "custom"
                    ? "自定义人格"
                    : PERSONALITY_MAP[activePersonality]?.label}
                  {" 回复："}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-card-foreground">
                {previewReply}
              </p>
            </div>
          </div>

          {/* Actions */}
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
