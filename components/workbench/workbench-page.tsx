"use client"

import { useState, useCallback } from "react"
import { Sparkles, Trash2, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IdentityBar } from "./identity-bar"
import { PhaseProgress } from "./phase-progress"
import { PlanCard } from "./plan-card"
import { LogCard } from "./log-card"
import { ReplyCard } from "./reply-card"
import type { TaskPhase, Permission, PersonalityKey } from "@/lib/types"
import {
  MOCK_PERMISSIONS,
  MOCK_PLAN_STEPS,
  MOCK_LOGS,
} from "@/lib/mock-data"

export function WorkbenchPage() {
  const [input, setInput] = useState("")
  const [phase, setPhase] = useState<TaskPhase>("input")
  const [permissions, setPermissions] = useState<Permission[]>(
    MOCK_PERMISSIONS.map((p) => ({ ...p }))
  )
  const [isGenerating, setIsGenerating] = useState(false)

  const allGranted = permissions.every((p) => p.granted)

  const handleGenerate = useCallback(() => {
    if (!input.trim()) return
    setIsGenerating(true)
    setPhase("planning")

    // Simulate plan generation
    setTimeout(() => {
      setIsGenerating(false)
      setPhase("approval")
    }, 1500)
  }, [input])

  const handleTogglePermission = useCallback((id: string) => {
    setPermissions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, granted: !p.granted } : p))
    )
  }, [])

  const handleApprove = useCallback(() => {
    setPhase("executing")
    // Simulate execution
    setTimeout(() => {
      setPhase("completed")
    }, 2000)
  }, [])

  const handleClear = useCallback(() => {
    setInput("")
    setPhase("input")
    setPermissions(MOCK_PERMISSIONS.map((p) => ({ ...p, granted: false })))
  }, [])

  const handleRewrite = useCallback((personality: PersonalityKey) => {
    // In a real app, this would call the API with the new personality
    console.log("Rewriting with personality:", personality)
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:py-8">
      <div className="flex flex-col gap-6">
        {/* Identity Bar */}
        <IdentityBar
          personality="professional"
          platform="wecom"
          isOnline={true}
        />

        {/* Phase Progress */}
        <PhaseProgress currentPhase={phase} />

        {/* Task Input */}
        <div className="rounded-xl border bg-card p-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="例如：帮我写一封活动邀请并发送给团队"
            className="min-h-24 resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            disabled={phase !== "input" && phase !== "planning"}
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="gap-1.5 text-muted-foreground"
            >
              <Trash2 className="h-4 w-4" />
              清空
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={!input.trim() || isGenerating || phase === "approval" || phase === "executing" || phase === "completed"}
              className="gap-1.5"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  生成方案
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {phase === "input" && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              输入你的任务指令
            </h3>
            <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
              描述你想完成的任务，AI 将生成执行方案供你审批后执行。支持文本生成、消息发送、文件保存等多种操作。
            </p>
          </div>
        )}

        {/* Generating State */}
        {phase === "planning" && isGenerating && (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <span className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
            <h3 className="text-sm font-medium text-foreground">
              正在生成执行方案...
            </h3>
            <p className="text-xs text-muted-foreground">
              AI 正在分析你的指令并规划最佳执行路径
            </p>
          </div>
        )}

        {/* Plan Card (Approval/Executing/Completed) */}
        {(phase === "approval" ||
          phase === "executing" ||
          phase === "completed") && (
          <PlanCard
            instruction={input}
            intent="消息群发"
            permissions={permissions}
            steps={
              phase === "completed"
                ? MOCK_PLAN_STEPS.map((s) => ({ ...s, status: "success" as const }))
                : MOCK_PLAN_STEPS
            }
            onTogglePermission={handleTogglePermission}
            onApprove={handleApprove}
            allGranted={allGranted}
            isApproval={phase === "approval"}
          />
        )}

        {/* Execution Logs */}
        {(phase === "executing" || phase === "completed") && (
          <LogCard
            logs={
              phase === "completed"
                ? MOCK_LOGS.map((l) => ({ ...l, status: "success" as const }))
                : MOCK_LOGS
            }
          />
        )}

        {/* Final Reply */}
        {phase === "completed" && (
          <ReplyCard
            reply="已成功生成活动邀请函（328字），并通过企业微信发送给「核心团队」共 12 位成员。发送记录已保存至 /logs/invite-0215.csv。"
            onRewrite={handleRewrite}
          />
        )}

        {/* Failed State */}
        {phase === "failed" && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center">
            <h3 className="text-sm font-semibold text-destructive">
              任务执行失败
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              钉钉消息接口响应超时，请检查网络连接后重试
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={handleClear}
            >
              重新开始
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
