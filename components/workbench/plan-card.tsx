"use client"

import {
  FileText,
  Users,
  Send,
  Save,
  Image,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Permission, PlanStep, StepStatus } from "@/lib/types"

const ICON_MAP: Record<string, typeof FileText> = {
  FileText,
  Users,
  Send,
  Save,
  Image,
}

function statusIcon(status: StepStatus) {
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

function statusLabel(status: StepStatus) {
  const map: Record<StepStatus, string> = {
    pending: "等待中",
    running: "执行中",
    success: "已完成",
    error: "失败",
    timeout: "超时",
  }
  return map[status]
}

interface PlanCardProps {
  instruction: string
  intent: string
  permissions: Permission[]
  steps: PlanStep[]
  onTogglePermission: (id: string) => void
  onApprove: () => void
  allGranted: boolean
  isApproval: boolean
}

export function PlanCard({
  instruction,
  intent,
  permissions,
  steps,
  onTogglePermission,
  onApprove,
  allGranted,
  isApproval,
}: PlanCardProps) {
  return (
    <div className="rounded-xl border bg-card">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-semibold text-card-foreground">
            执行方案
          </h3>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            {intent}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{instruction}</p>
      </div>

      {/* Permissions */}
      {isApproval && (
        <div className="border-b p-4">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            所需权限
          </h4>
          <div className="flex flex-col gap-2.5">
            {permissions.map((perm) => (
              <label
                key={perm.id}
                className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <Checkbox
                  checked={perm.granted}
                  onCheckedChange={() => onTogglePermission(perm.id)}
                  className="mt-0.5"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-card-foreground">
                    {perm.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {perm.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Steps */}
      <div className="p-4">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          执行步骤
        </h4>
        <div className="flex flex-col gap-2">
          {steps.map((step, i) => {
            const ToolIcon = ICON_MAP[step.toolIcon] || FileText
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-3 transition-colors",
                  step.status === "running" && "border-primary/40 bg-primary/5",
                  step.status === "error" &&
                    "border-destructive/40 bg-destructive/5"
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
                    {statusIcon(step.status)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {step.paramSummary}
                  </span>
                  {step.dependsOn.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
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
                <span className="mt-0.5 shrink-0 text-[10px] text-muted-foreground">
                  {statusLabel(step.status)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Approve Button */}
      {isApproval && (
        <div className="border-t p-4">
          <Button
            onClick={onApprove}
            disabled={!allGranted}
            className="w-full"
          >
            {allGranted ? "批准并执行" : "请先授权所有权限"}
          </Button>
          {!allGranted && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              请先勾选上方所有权限后方可执行
            </p>
          )}
        </div>
      )}
    </div>
  )
}
