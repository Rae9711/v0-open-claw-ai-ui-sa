/** Agent cultivation / cosmetic system types */

export type AgentStatus = "idle" | "thinking" | "completed" | "failed" | "leveling_up"
export type BaseForm = "fire" | "robot" | "cat" | "pixel"
export type CosmeticSlot = "hat" | "face" | "back" | "aura" | "background"

export interface CosmeticItem {
  id: string
  slot: CosmeticSlot
  name: string
  icon: string               // emoji / SVG id used for rendering
  unlockLevel: number
  unlockLabel: string        // e.g. "Lv.5 解锁"
  rarity: "common" | "rare" | "epic"
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number           // 0-100
  completed: boolean
  reward?: string            // cosmetic id
  rewardLabel?: string
}

export interface AgentProgress {
  level: number
  xp: number
  xpToNext: number
  streakDays: number
  totalTasks: number
  totalMessages: number
}

export interface AgentProfile {
  name: string
  bio: string
  voiceStyle: string
  catchphrase: string
  themeColor: string
}

/** Level thresholds for base form unlocks */
export const FORM_UNLOCK_LEVELS: Record<BaseForm, number> = {
  fire: 1,
  robot: 1,
  cat: 5,
  pixel: 10,
}

export const FORM_LABELS: Record<BaseForm, string> = {
  fire: "小火人",
  robot: "机器人",
  cat: "猫咪",
  pixel: "像素人",
}

/** All available cosmetics */
export const ALL_COSMETICS: CosmeticItem[] = [
  // Hats
  { id: "hat-crown", slot: "hat", name: "皇冠", icon: "\uD83D\uDC51", unlockLevel: 1, unlockLabel: "默认", rarity: "common" },
  { id: "hat-cap", slot: "hat", name: "棒球帽", icon: "\uD83E\uDDE2", unlockLevel: 3, unlockLabel: "Lv.3", rarity: "common" },
  { id: "hat-tophat", slot: "hat", name: "礼帽", icon: "\uD83C\uDFA9", unlockLevel: 7, unlockLabel: "Lv.7", rarity: "rare" },
  { id: "hat-helmet", slot: "hat", name: "头盔", icon: "\uD83E\uDE96", unlockLevel: 12, unlockLabel: "Lv.12", rarity: "epic" },
  // Face
  { id: "face-glasses", slot: "face", name: "眼镜", icon: "\uD83D\uDC53", unlockLevel: 1, unlockLabel: "默认", rarity: "common" },
  { id: "face-sunglasses", slot: "face", name: "墨镜", icon: "\uD83D\uDD76\uFE0F", unlockLevel: 4, unlockLabel: "Lv.4", rarity: "common" },
  { id: "face-monocle", slot: "face", name: "单片镜", icon: "\uD83E\uDDD0", unlockLevel: 8, unlockLabel: "Lv.8", rarity: "rare" },
  // Back
  { id: "back-wings", slot: "back", name: "翅膀", icon: "\uD83E\uDEB6", unlockLevel: 6, unlockLabel: "Lv.6", rarity: "rare" },
  { id: "back-cape", slot: "back", name: "披风", icon: "\uD83E\uDDE3", unlockLevel: 10, unlockLabel: "Lv.10", rarity: "epic" },
  // Aura
  { id: "aura-blue", slot: "aura", name: "蓝色光环", icon: "\uD83D\uDD35", unlockLevel: 2, unlockLabel: "Lv.2", rarity: "common" },
  { id: "aura-gold", slot: "aura", name: "金色光环", icon: "\uD83D\uDFE1", unlockLevel: 9, unlockLabel: "Lv.9", rarity: "rare" },
  { id: "aura-purple", slot: "aura", name: "紫色光环", icon: "\uD83D\uDFE3", unlockLevel: 15, unlockLabel: "Lv.15", rarity: "epic" },
  // Background
  { id: "bg-stars", slot: "background", name: "星空", icon: "\u2B50", unlockLevel: 1, unlockLabel: "默认", rarity: "common" },
  { id: "bg-sakura", slot: "background", name: "樱花", icon: "\uD83C\uDF38", unlockLevel: 5, unlockLabel: "Lv.5", rarity: "rare" },
  { id: "bg-lightning", slot: "background", name: "闪电", icon: "\u26A1", unlockLevel: 11, unlockLabel: "Lv.11", rarity: "epic" },
]

export const SLOT_LABELS: Record<CosmeticSlot, string> = {
  hat: "帽子",
  face: "面部",
  back: "背饰",
  aura: "光环",
  background: "背景",
}

/** Mock achievements */
export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: "ach-first-task", title: "初出茅庐", description: "完成第一个任务", icon: "\uD83C\uDF1F", progress: 100, completed: true, reward: "hat-crown", rewardLabel: "皇冠" },
  { id: "ach-streak-3", title: "三日之约", description: "连续 3 天与 Agent 互动", icon: "\uD83D\uDD25", progress: 100, completed: true },
  { id: "ach-streak-7", title: "周周不断", description: "连续 7 天与 Agent 互动", icon: "\uD83D\uDCAA", progress: 71, completed: false },
  { id: "ach-tasks-10", title: "十全十美", description: "累计完成 10 个任务", icon: "\uD83C\uDFC6", progress: 50, completed: false, reward: "face-sunglasses", rewardLabel: "墨镜" },
  { id: "ach-tools-5", title: "工具达人", description: "使用 5 种不同工具", icon: "\uD83D\uDD27", progress: 60, completed: false },
  { id: "ach-share", title: "分享达人", description: "分享 3 次任务成果", icon: "\uD83D\uDCE4", progress: 33, completed: false, reward: "back-wings", rewardLabel: "翅膀" },
]

/** Mock initial progress */
export const MOCK_PROGRESS: AgentProgress = {
  level: 6,
  xp: 340,
  xpToNext: 500,
  streakDays: 5,
  totalTasks: 5,
  totalMessages: 47,
}

export const MOCK_PROFILE: AgentProfile = {
  name: "OpenClaw",
  bio: "你的智能办公助手，擅长文案、消息和数据分析",
  voiceStyle: "professional",
  catchphrase: "有什么我能帮你的？",
  themeColor: "#1a73e8",
}
