"use client"

import { Bot, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { PersonalityKey, PlatformKey } from "@/lib/types"
import { PERSONALITY_MAP, PLATFORM_MAP } from "@/lib/types"

interface IdentityBarProps {
  personality: PersonalityKey
  platform: PlatformKey
  isOnline: boolean
}

export function IdentityBar({
  personality,
  platform,
  isOnline,
}: IdentityBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Bot className="h-6 w-6 text-primary" />
      </div>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-card-foreground">
            OpenClaw 助手
          </span>
          <Badge variant="secondary" className="text-xs">
            {PERSONALITY_MAP[personality].label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {PLATFORM_MAP[platform]}
          </Badge>
        </div>
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="h-3 w-3 text-success" />
              <span className="text-xs text-success">本地运行中</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">未连接</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
