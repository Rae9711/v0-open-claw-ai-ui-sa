"use client"

import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  ALL_COSMETICS,
  SLOT_LABELS,
  type CosmeticSlot,
  type CosmeticItem,
} from "@/lib/agent-types"

const RARITY_COLORS: Record<string, string> = {
  common: "border-border",
  rare: "border-primary/40",
  epic: "border-warning/50",
}

const RARITY_BG: Record<string, string> = {
  common: "",
  rare: "bg-primary/5",
  epic: "bg-warning/5",
}

const RARITY_LABELS: Record<string, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
}

interface CosmeticsPanelProps {
  level: number
  activeSlot: CosmeticSlot
  onSlotChange: (slot: CosmeticSlot) => void
  equipped: Partial<Record<CosmeticSlot, string>>
  onEquip: (slot: CosmeticSlot, itemIcon: string | undefined) => void
}

const SLOTS: CosmeticSlot[] = ["hat", "face", "back", "aura", "background"]

export function CosmeticsPanel({
  level,
  activeSlot,
  onSlotChange,
  equipped,
  onEquip,
}: CosmeticsPanelProps) {
  const slotItems = ALL_COSMETICS.filter((c) => c.slot === activeSlot)

  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-card-foreground">
        装扮中心
      </h3>

      {/* Slot tabs */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto pb-1">
        {SLOTS.map((slot) => {
          const equippedCount = equipped[slot] ? 1 : 0
          return (
            <button
              key={slot}
              onClick={() => onSlotChange(slot)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors",
                activeSlot === slot
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:bg-muted"
              )}
            >
              {SLOT_LABELS[slot]}
              {equippedCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground">
                  {equippedCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Items grid */}
      <TooltipProvider delayDuration={200}>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {/* "None" option */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onEquip(activeSlot, undefined)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors",
                  !equipped[activeSlot]
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted"
                )}
              >
                <span className="text-lg text-muted-foreground">{"--"}</span>
                <span className="text-[10px] text-muted-foreground">无</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>移除当前装饰</TooltipContent>
          </Tooltip>

          {slotItems.map((item) => {
            const locked = item.unlockLevel > level
            const isEquipped = equipped[activeSlot] === item.icon

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      if (!locked) {
                        onEquip(activeSlot, isEquipped ? undefined : item.icon)
                      }
                    }}
                    disabled={locked}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors",
                      locked
                        ? "cursor-not-allowed border-border opacity-50"
                        : isEquipped
                          ? "border-primary bg-primary/5"
                          : cn(
                              "hover:bg-muted",
                              RARITY_COLORS[item.rarity],
                              RARITY_BG[item.rarity]
                            )
                    )}
                  >
                    {locked ? (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <span className="text-lg">{item.icon}</span>
                    )}
                    <span
                      className={cn(
                        "text-[10px]",
                        locked ? "text-muted-foreground" : "text-card-foreground"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.rarity !== "common" && !locked && (
                      <Badge
                        variant="secondary"
                        className={cn(
                          "absolute -top-1 -right-1 px-1 py-0 text-[8px]",
                          item.rarity === "epic" && "bg-warning/10 text-warning"
                        )}
                      >
                        {RARITY_LABELS[item.rarity]}
                      </Badge>
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {locked
                    ? `${item.unlockLabel} 解锁`
                    : `${item.name} (${RARITY_LABELS[item.rarity]})`}
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}
