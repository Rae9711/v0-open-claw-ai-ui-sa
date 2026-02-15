"use client"

import { RefreshCw, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PERSONALITY_MAP } from "@/lib/types"
import type { PersonalityKey } from "@/lib/types"

interface ReplyCardProps {
  reply: string
  onRewrite: (personality: PersonalityKey) => void
}

const personalities: PersonalityKey[] = [
  "professional",
  "friendly_coach",
  "no_bs",
  "playful_nerd",
]

export function ReplyCard({ reply, onRewrite }: ReplyCardProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">
            最终回复
          </h3>
        </div>
      </div>
      <div className="p-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm leading-relaxed text-card-foreground">{reply}</p>
        </div>
      </div>
      <div className="border-t p-4">
        <p className="mb-2 text-xs text-muted-foreground">换个风格重写</p>
        <div className="flex flex-wrap gap-2">
          {personalities.map((key) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => onRewrite(key)}
              className="gap-1.5 text-xs"
            >
              <RefreshCw className="h-3 w-3" />
              {PERSONALITY_MAP[key].label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
