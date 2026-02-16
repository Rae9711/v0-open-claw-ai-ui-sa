"use client"

import { Bot } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PersonalityKey, PersonalityConfig } from "@/lib/types"
import { PERSONALITY_MAP } from "@/lib/types"

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

const PREVIEW_REPLIES: Record<PersonalityKey, string> = {
  professional:
    "根据您提供的需求，我已完成活动邀请函的撰写。正文围绕三个核心要点展开：活动价值、议程亮点和参与方式。建议您确认后安排发送。",
  friendly_coach:
    "邀请函写好啦！我把重点放在了活动对大家成长的帮助上，读起来应该蛮温馨的。你看看哪里需要调整，我再帮你改。",
  no_bs: "邀请函已生成。328字，含时间地点议程。确认就发。",
  playful_nerd:
    "叮！你的超级邀请函已出炉～我用了最新的 NLP 模型优化了措辞，信息密度拉满的同时保持了可读性。要不要看看？",
}

interface IdentityPanelProps {
  config: PersonalityConfig
  onUpdate: (partial: Partial<PersonalityConfig>) => void
}

export function IdentityPanel({ config, onUpdate }: IdentityPanelProps) {
  const activePersonality = config.key as PersonalityKey
  const previewReply =
    config.key === "custom"
      ? PREVIEW_REPLIES.professional
      : PREVIEW_REPLIES[activePersonality]

  return (
    <div className="flex flex-col gap-5">
      {/* Personality Picker */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-card-foreground">
          人格模式
        </h3>
        <RadioGroup
          value={config.key}
          onValueChange={(val) =>
            onUpdate({
              key: val as PersonalityKey,
              label:
                PERSONALITY_MAP[val as PersonalityKey]?.label ?? "自定义",
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

      {/* Advanced Tuning */}
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
              <Label className="text-xs text-muted-foreground">语气风格</Label>
              <span className="text-xs tabular-nums text-muted-foreground">
                {config.tone <= 33
                  ? "严谨"
                  : config.tone <= 66
                    ? "平衡"
                    : "亲和"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-muted-foreground">严谨</span>
              <Slider
                value={[config.tone]}
                onValueChange={([v]) => onUpdate({ tone: v })}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-[10px] text-muted-foreground">亲和</span>
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
                  onClick={() => onUpdate({ replyLength: rl.key })}
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
                  onClick={() => onUpdate({ emojiDensity: ed.key })}
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
              onCheckedChange={(v) => onUpdate({ allowQuestionEnding: v })}
            />
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="rounded-xl border bg-card p-5">
        <h3 className="mb-3 text-sm font-semibold text-card-foreground">
          效果预览
        </h3>
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
    </div>
  )
}
