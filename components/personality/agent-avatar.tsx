"use client"

import { useRef, useCallback } from "react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { cn } from "@/lib/utils"
import type { CosmeticSlot, AgentStatus } from "@/lib/agent-types"

/**
 * Cloud Robotics Lottie avatar with cosmetic overlay slots and animated status ring.
 *
 * Replace LOTTIE_SRC with your own lottie.host CDN URL if needed.
 * To get the URL: open the animation on lottiefiles.com -> "Asset & Embed" tab -> generate link.
 */
const LOTTIE_SRC =
  "https://lottie.host/4db68bbd-31f6-4cd8-84eb-189de081159a/IGmMCqhzpt.lottie"

interface AgentAvatarProps {
  equipped: Partial<Record<CosmeticSlot, string>>
  status: AgentStatus
  size?: "sm" | "md" | "lg"
  className?: string
}

const SIZE_MAP = { sm: 80, md: 140, lg: 200 }

const STATUS_STYLES: Record<
  AgentStatus,
  { ring: string; label: string; dashArray?: string }
> = {
  idle: {
    ring: "stroke-muted-foreground/20",
    label: "idle",
  },
  thinking: {
    ring: "stroke-primary",
    label: "thinking",
    dashArray: "10 5",
  },
  completed: {
    ring: "stroke-success",
    label: "completed",
  },
  failed: {
    ring: "stroke-destructive",
    label: "failed",
  },
  leveling_up: {
    ring: "stroke-warning",
    label: "leveling_up",
  },
}

/* Aura colour mapping – maps the emoji icon to a real CSS colour */
const AURA_COLORS: Record<string, string> = {
  "\uD83D\uDD35": "rgba(59,130,246,0.18)",   // blue
  "\uD83D\uDFE1": "rgba(234,179,8,0.16)",    // gold
  "\uD83D\uDFE3": "rgba(168,85,247,0.16)",   // purple
}

export function AgentAvatar({
  equipped,
  status,
  size = "md",
  className,
}: AgentAvatarProps) {
  const px = SIZE_MAP[size]
  const s = STATUS_STYLES[status]

  const dotLottieRef = useRef<ReturnType<typeof DotLottieReact> | null>(null)

  const handleDotLottieRef = useCallback(
    (instance: unknown) => {
      dotLottieRef.current = instance as ReturnType<typeof DotLottieReact>
      // Slow down / pause based on status
      if (instance && typeof (instance as Record<string, unknown>).setSpeed === "function") {
        const player = instance as { setSpeed: (s: number) => void; pause: () => void; play: () => void }
        if (status === "idle") player.setSpeed(0.6)
        else if (status === "thinking") player.setSpeed(1.8)
        else if (status === "failed") player.setSpeed(0.3)
        else player.setSpeed(1)
      }
    },
    [status]
  )

  const auraColor = equipped.aura ? (AURA_COLORS[equipped.aura] ?? "rgba(59,130,246,0.12)") : undefined

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: px, height: px }}
      role="img"
      aria-label="OpenClaw Agent avatar"
    >
      {/* Outer status ring */}
      <svg
        className="absolute inset-0"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx="50"
          cy="50"
          r="47"
          strokeWidth="1.5"
          className="stroke-border"
        />
        {/* Animated ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          strokeWidth="2.5"
          strokeLinecap="round"
          className={cn(
            "transition-all duration-500",
            s.ring,
            status === "thinking" && "animate-spin [animation-duration:3s]",
            status === "leveling_up" && "animate-pulse"
          )}
          strokeDasharray={s.dashArray}
        />
      </svg>

      {/* Aura glow layer */}
      {auraColor && (
        <div
          className={cn(
            "absolute inset-[8%] rounded-full blur-md",
            status === "leveling_up" && "animate-pulse"
          )}
          style={{ backgroundColor: auraColor }}
          aria-hidden="true"
        />
      )}

      {/* Background plate */}
      {equipped.background && (
        <div className="absolute inset-[12%] flex items-center justify-center rounded-2xl bg-muted/30" aria-hidden="true">
          <span className="text-2xl opacity-20">{equipped.background}</span>
        </div>
      )}

      {/* Back cosmetic (behind avatar) */}
      {equipped.back && (
        <span
          className="absolute z-0 text-xl opacity-60"
          style={{
            right: size === "lg" ? "10%" : "8%",
            top: "30%",
          }}
          aria-hidden="true"
        >
          {equipped.back}
        </span>
      )}

      {/* Main Lottie avatar */}
      <div className="relative z-10" style={{ width: px * 0.65, height: px * 0.65 }}>
        <DotLottieReact
          src={LOTTIE_SRC}
          loop
          autoplay
          dotLottieRefCallback={handleDotLottieRef}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Hat cosmetic (above avatar) */}
      {equipped.hat && (
        <span
          className="absolute z-20"
          style={{
            top: size === "lg" ? "6%" : "8%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: size === "lg" ? "1.5rem" : size === "md" ? "1.25rem" : "1rem",
          }}
          aria-hidden="true"
        >
          {equipped.hat}
        </span>
      )}

      {/* Face cosmetic (center overlay) */}
      {equipped.face && (
        <span
          className="absolute z-20"
          style={{
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: size === "lg" ? "1rem" : "0.875rem",
          }}
          aria-hidden="true"
        >
          {equipped.face}
        </span>
      )}
    </div>
  )
}
