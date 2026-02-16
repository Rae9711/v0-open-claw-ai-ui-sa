"use client"

import { cn } from "@/lib/utils"
import type { CosmeticSlot, AgentStatus } from "@/lib/agent-types"

/** SVG-based layered agent avatar with cosmetic slots and status animations */

interface AgentAvatarProps {
  baseForm: "fire" | "robot" | "cat" | "pixel"
  equipped: Partial<Record<CosmeticSlot, string>>
  status: AgentStatus
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = { sm: 80, md: 120, lg: 180 }

const BASE_COLORS: Record<string, { body: string; accent: string }> = {
  fire: { body: "#F97316", accent: "#FDBA74" },
  robot: { body: "hsl(210 100% 45%)", accent: "hsl(210 100% 70%)" },
  cat: { body: "#A78BFA", accent: "#DDD6FE" },
  pixel: { body: "#10B981", accent: "#6EE7B7" },
}

const STATUS_RING: Record<AgentStatus, string> = {
  idle: "stroke-muted-foreground/30",
  thinking: "stroke-primary animate-spin",
  completed: "stroke-success",
  failed: "stroke-destructive",
  leveling_up: "stroke-warning animate-pulse",
}

export function AgentAvatar({
  baseForm,
  equipped,
  status,
  size = "md",
  className,
}: AgentAvatarProps) {
  const px = SIZE_MAP[size]
  const colors = BASE_COLORS[baseForm]

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: px, height: px }}
    >
      {/* Status ring */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="47"
          strokeWidth="2.5"
          className={cn("transition-all duration-500", STATUS_RING[status])}
          strokeDasharray={status === "thinking" ? "12 6" : undefined}
        />
      </svg>

      {/* Base body */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-[10%]"
        aria-label={`${baseForm} agent avatar`}
      >
        {/* Aura glow */}
        {equipped.aura && (
          <circle
            cx="50"
            cy="50"
            r="44"
            fill={equipped.aura}
            opacity="0.15"
            className={status === "leveling_up" ? "animate-pulse" : ""}
          />
        )}

        {/* Background plate */}
        {equipped.background && (
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="16"
            fill={equipped.background}
            opacity="0.1"
          />
        )}

        {/* Main body shape */}
        {baseForm === "fire" && (
          <g>
            <ellipse cx="50" cy="58" rx="22" ry="26" fill={colors.body} />
            <ellipse cx="50" cy="56" rx="18" ry="20" fill={colors.accent} opacity="0.5" />
            {/* Flame tips */}
            <path
              d="M38 38 C38 28 50 18 50 18 C50 18 62 28 62 38 C62 42 58 46 50 46 C42 46 38 42 38 38Z"
              fill={colors.body}
              className={status === "thinking" ? "animate-bounce" : ""}
            />
            {/* Eyes */}
            <circle cx="42" cy="54" r="3" fill="hsl(var(--card))" />
            <circle cx="58" cy="54" r="3" fill="hsl(var(--card))" />
            <circle cx="43" cy="53" r="1.2" fill="hsl(var(--foreground))" />
            <circle cx="59" cy="53" r="1.2" fill="hsl(var(--foreground))" />
            {/* Mouth */}
            {status === "completed" ? (
              <path d="M44 62 Q50 68 56 62" stroke="hsl(var(--card))" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : status === "failed" ? (
              <path d="M44 66 Q50 60 56 66" stroke="hsl(var(--card))" strokeWidth="2" fill="none" strokeLinecap="round" />
            ) : (
              <ellipse cx="50" cy="63" rx="4" ry="2" fill="hsl(var(--card))" opacity="0.7" />
            )}
          </g>
        )}

        {baseForm === "robot" && (
          <g>
            {/* Body */}
            <rect x="30" y="40" width="40" height="36" rx="8" fill={colors.body} />
            {/* Head */}
            <rect x="32" y="22" width="36" height="28" rx="10" fill={colors.body} />
            {/* Antenna */}
            <line x1="50" y1="22" x2="50" y2="14" stroke={colors.accent} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="50" cy="12" r="3" fill={colors.accent} className={status === "thinking" ? "animate-ping" : ""} />
            {/* Eyes */}
            <rect x="38" y="32" width="8" height="8" rx="2" fill="hsl(var(--card))" />
            <rect x="54" y="32" width="8" height="8" rx="2" fill="hsl(var(--card))" />
            <rect x="40" y="34" width="4" height="4" rx="1" fill="hsl(var(--foreground))" />
            <rect x="56" y="34" width="4" height="4" rx="1" fill="hsl(var(--foreground))" />
            {/* Mouth */}
            <rect x="40" y="44" width="20" height="3" rx="1.5" fill={colors.accent} />
            {/* Arms */}
            <rect x="22" y="44" width="8" height="4" rx="2" fill={colors.accent} />
            <rect x="70" y="44" width="8" height="4" rx="2" fill={colors.accent} />
          </g>
        )}

        {baseForm === "cat" && (
          <g>
            {/* Body */}
            <ellipse cx="50" cy="60" rx="24" ry="22" fill={colors.body} />
            {/* Ears */}
            <path d="M30 44 L34 26 L42 40Z" fill={colors.body} />
            <path d="M70 44 L66 26 L58 40Z" fill={colors.body} />
            <path d="M33 42 L36 30 L41 40Z" fill={colors.accent} opacity="0.6" />
            <path d="M67 42 L64 30 L59 40Z" fill={colors.accent} opacity="0.6" />
            {/* Eyes */}
            <ellipse cx="42" cy="54" rx="4" ry="4.5" fill="hsl(var(--card))" />
            <ellipse cx="58" cy="54" rx="4" ry="4.5" fill="hsl(var(--card))" />
            <ellipse cx="43" cy="54" rx="2" ry="2.5" fill="hsl(var(--foreground))" />
            <ellipse cx="59" cy="54" rx="2" ry="2.5" fill="hsl(var(--foreground))" />
            {/* Nose + Whiskers */}
            <ellipse cx="50" cy="60" rx="2" ry="1.5" fill={colors.accent} />
            <line x1="30" y1="58" x2="44" y2="60" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
            <line x1="30" y1="62" x2="44" y2="62" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
            <line x1="56" y1="60" x2="70" y2="58" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
            <line x1="56" y1="62" x2="70" y2="62" stroke={colors.accent} strokeWidth="1" opacity="0.5" />
            {/* Tail */}
            <path d="M74 62 Q82 50 78 40" stroke={colors.body} strokeWidth="4" fill="none" strokeLinecap="round"
              className={status === "idle" ? "origin-bottom-left animate-[wiggle_2s_ease-in-out_infinite]" : ""}
            />
          </g>
        )}

        {baseForm === "pixel" && (
          <g>
            {/* Blocky head */}
            <rect x="30" y="24" width="40" height="36" rx="4" fill={colors.body} />
            {/* Body */}
            <rect x="34" y="60" width="32" height="20" rx="4" fill={colors.body} />
            {/* Eyes */}
            <rect x="38" y="36" width="6" height="6" fill="hsl(var(--card))" />
            <rect x="56" y="36" width="6" height="6" fill="hsl(var(--card))" />
            <rect x="39" y="37" width="4" height="4" fill="hsl(var(--foreground))" />
            <rect x="57" y="37" width="4" height="4" fill="hsl(var(--foreground))" />
            {/* Mouth */}
            <rect x="42" y="48" width="16" height="4" rx="1" fill={colors.accent} />
            {/* Feet */}
            <rect x="36" y="78" width="10" height="6" rx="2" fill={colors.accent} />
            <rect x="54" y="78" width="10" height="6" rx="2" fill={colors.accent} />
          </g>
        )}

        {/* Cosmetic overlays */}
        {equipped.hat && (
          <text x="50" y="18" textAnchor="middle" fontSize="16" aria-hidden="true">
            {equipped.hat}
          </text>
        )}
        {equipped.face && (
          <text x="50" y="52" textAnchor="middle" fontSize="10" aria-hidden="true">
            {equipped.face}
          </text>
        )}
        {equipped.back && (
          <text x="78" y="50" textAnchor="middle" fontSize="12" aria-hidden="true">
            {equipped.back}
          </text>
        )}
      </svg>
    </div>
  )
}
