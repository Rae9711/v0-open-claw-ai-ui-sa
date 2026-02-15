"use client"

import { useState, useMemo, useCallback } from "react"
import {
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Shield,
  ChevronRight,
  FileText,
  Users,
  Send,
  Save,
  Image,
  Download,
  RefreshCw,
  Inbox,
  ArrowRight,
  Bot,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { TaskPhase, TaskRecord, StepStatus } from "@/lib/types"
import { MOCK_TASKS } from "@/lib/mock-data"

type FilterKey = "all" | "approval" | "executing" | "completed" | "failed"

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "approval", label: "待审批" },
  { key: "executing", label: "执行中" },
  { key: "completed", label: "已完成" },
  { key: "failed", label: "失败" },
]

const ICON_MAP: Record<string, typeof FileText> = {
  FileText,
  Users,
  Send,
  Save,
  Image,
}

function statusConfig(status: TaskPhase) {
  switch (status) {
    case "approval":
      return {
        icon: Shield,
        label: "待审批",
        className: "bg-warning/10 text-warning border-warning/20",
      }
    case "executing":
      return {
        icon: Loader2,
        label: "执行中",
        className: "bg-primary/10 text-primary border-primary/20",
      }
    case "completed":
      return {
        icon: CheckCircle2,
        label: "已完成",
        className: "bg-success/10 text-success border-success/20",
      }
    case "failed":
      return {
        icon: XCircle,
        label: "失败",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      }
    default:
      return {
        icon: Clock,
        label: "进行中",
        className: "bg-muted text-muted-foreground",
      }
  }
}

function stepStatusIcon(status: StepStatus) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-success" />
    case "running":
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />
    case "timeout":
      return <Clock className="h-4 w-4 text-warning" />
    default:
      return (
        <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
      )
  }
}

export function TaskCenterPage() {
  const [filter, setFilter] = useState<FilterKey>("all")
  const [selectedTask, setSelectedTask] = useState<TaskRecord | null>(null)

  const filteredTasks = useMemo(() => {
    if (filter === "all") return MOCK_TASKS
    return MOCK_TASKS.filter((t) => t.status === filter)
  }, [filter])

  const handleCloseDrawer = useCallback(() => {
    setSelectedTask(null)
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 lg:py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-foreground">任务中心</h2>
          <p className="text-sm text-muted-foreground">
            查看任务执行记录，审计每一步操作
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto" role="tablist" aria-label="任务筛选">
          {FILTERS.map((f) => {
            const count =
              f.key === "all"
                ? MOCK_TASKS.length
                : MOCK_TASKS.filter((t) => t.status === f.key).length
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground hover:bg-secondary"
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-semibold",
                    filter === f.key
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Task List */}
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">暂无任务</h3>
            <p className="text-xs text-muted-foreground">
              当前筛选条件下没有匹配的任务记录
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredTasks.map((task) => {
              const sc = statusConfig(task.status)
              const StatusIcon = sc.icon
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={cn(
                    "flex items-start gap-4 rounded-xl border bg-card p-4 text-left transition-all hover:shadow-sm",
                    selectedTask?.id === task.id && "ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-card-foreground">
                        {task.instruction}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", sc.className)}
                      >
                        <StatusIcon
                          className={cn(
                            "mr-1 h-3 w-3",
                            task.status === "executing" && "animate-spin"
                          )}
                        />
                        {sc.label}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{task.intent}</span>
                      <span>{task.createdAt}</span>
                      <span>{task.stepCount} 步</span>
                      {task.permissions.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          {task.permissions.slice(0, 2).join("、")}
                          {task.permissions.length > 2 &&
                            ` 等 ${task.permissions.length} 项`}
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Task Detail Drawer (Sheet-like overlay) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-foreground/20"
            onClick={handleCloseDrawer}
          />
          <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-card shadow-xl">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-semibold text-card-foreground">
                  任务详情
                </h3>
                <span className="text-xs text-muted-foreground">
                  {selectedTask.id}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDrawer}
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-5 p-5">
                {/* Instruction */}
                <div>
                  <Label className="text-muted-foreground">原始指令</Label>
                  <p className="mt-1 text-sm text-card-foreground">
                    {selectedTask.instruction}
                  </p>
                </div>

                {/* Meta */}
                <div className="grid grid-cols-2 gap-3">
                  <MetaItem label="意图" value={selectedTask.intent} />
                  <MetaItem label="时间" value={selectedTask.createdAt} />
                  <MetaItem
                    label="状态"
                    value={statusConfig(selectedTask.status).label}
                  />
                  <MetaItem
                    label="步骤数"
                    value={`${selectedTask.stepCount} 步`}
                  />
                </div>

                {/* Steps */}
                <div>
                  <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    执行计划
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedTask.steps.map((step) => {
                      const ToolIcon = ICON_MAP[step.toolIcon] || FileText
                      return (
                        <div
                          key={step.id}
                          className={cn(
                            "flex items-start gap-3 rounded-lg border p-3",
                            step.status === "error" &&
                              "border-destructive/30 bg-destructive/5"
                          )}
                        >
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary">
                            <ToolIcon className="h-4 w-4 text-secondary-foreground" />
                          </div>
                          <div className="flex flex-1 flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-card-foreground">
                                {step.id}. {step.label}
                              </span>
                              {stepStatusIcon(step.status)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {step.paramSummary}
                            </span>
                            {step.dependsOn.length > 0 && (
                              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                                <ArrowRight className="h-3 w-3" />
                                {"依赖步骤 "}
                                {step.dependsOn.join("、")}
                              </div>
                            )}
                            {step.status === "error" && step.result && (
                              <p className="mt-1 text-xs text-destructive">
                                {step.result}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Logs */}
                {selectedTask.logs.length > 0 && (
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      执行日志
                    </h4>
                    <div className="flex flex-col gap-0 divide-y rounded-lg border">
                      {selectedTask.logs.map((log) => (
                        <div
                          key={log.id}
                          className={cn(
                            "flex items-start gap-3 px-3 py-2.5",
                            log.status === "error" && "bg-destructive/5"
                          )}
                        >
                          {log.status === "success" && (
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                          )}
                          {log.status === "running" && (
                            <Loader2 className="mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin text-primary" />
                          )}
                          {log.status === "error" && (
                            <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                          )}
                          <div className="flex flex-1 flex-col gap-0.5">
                            <span className="text-xs text-muted-foreground">
                              {log.event}
                            </span>
                            <span className="text-sm text-card-foreground">
                              {log.summary}
                            </span>
                          </div>
                          <span className="mt-0.5 text-[10px] tabular-nums text-muted-foreground">
                            {log.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Final Reply */}
                {selectedTask.finalReply && (
                  <div>
                    <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      最终回复
                    </h4>
                    <div className="rounded-lg bg-muted/50 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground">
                          AI 回复
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-card-foreground">
                        {selectedTask.finalReply}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Drawer Actions */}
            <div className="flex gap-2 border-t p-4">
              {selectedTask.status === "failed" && (
                <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5" />
                  重新执行
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                <Download className="h-3.5 w-3.5" />
                导出记录
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-wider",
        className
      )}
    >
      {children}
    </span>
  )
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2.5">
      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <p className="mt-0.5 text-sm font-medium text-card-foreground">{value}</p>
    </div>
  )
}
