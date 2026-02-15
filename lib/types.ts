export type PersonalityKey =
  | "professional"
  | "friendly_coach"
  | "no_bs"
  | "playful_nerd"

export type PlatformKey =
  | "imessage"
  | "sms"
  | "wecom"
  | "dingtalk"
  | "feishu"

export type TaskPhase =
  | "input"
  | "planning"
  | "approval"
  | "executing"
  | "completed"
  | "failed"

export type StepStatus = "pending" | "running" | "success" | "error" | "timeout"

export interface Permission {
  id: string
  label: string
  description: string
  granted: boolean
}

export interface PlanStep {
  id: number
  tool: string
  toolIcon: string
  label: string
  paramSummary: string
  dependsOn: number[]
  status: StepStatus
  result?: string
}

export interface LogEntry {
  id: string
  event: string
  summary: string
  status: "running" | "success" | "error"
  timestamp: string
}

export interface TaskRecord {
  id: string
  instruction: string
  intent: string
  createdAt: string
  stepCount: number
  permissions: string[]
  status: TaskPhase
  steps: PlanStep[]
  logs: LogEntry[]
  finalReply?: string
}

export interface PersonalityConfig {
  key: PersonalityKey | "custom"
  label: string
  tone: number // 0 = strict, 100 = warm
  replyLength: "short" | "medium" | "long"
  emojiDensity: "off" | "low" | "medium"
  allowQuestionEnding: boolean
}

export const PERSONALITY_MAP: Record<
  PersonalityKey,
  { label: string; description: string }
> = {
  professional: { label: "专业顾问", description: "严谨专业，逻辑清晰" },
  friendly_coach: { label: "贴心教练", description: "温和亲切，循循善诱" },
  no_bs: { label: "直言不讳", description: "简洁高效，直奔主题" },
  playful_nerd: { label: "极客玩家", description: "活泼有趣，技术范儿" },
}

export const PLATFORM_MAP: Record<PlatformKey, string> = {
  imessage: "iMessage",
  sms: "短信",
  wecom: "企业微信",
  dingtalk: "钉钉",
  feishu: "飞书",
}

export const PHASE_LABELS: Record<TaskPhase, string> = {
  input: "输入指令",
  planning: "生成方案",
  approval: "审批方案",
  executing: "执行中",
  completed: "完成",
  failed: "失败",
}
