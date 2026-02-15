"use client"

import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { LogEntry } from "@/lib/types"

interface LogCardProps {
  logs: LogEntry[]
}

function logIcon(status: LogEntry["status"]) {
  switch (status) {
    case "success":
      return <CheckCircle2 className="h-4 w-4 text-success" />
    case "running":
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />
    case "error":
      return <XCircle className="h-4 w-4 text-destructive" />
  }
}

export function LogCard({ logs }: LogCardProps) {
  if (logs.length === 0) return null

  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b p-4">
        <h3 className="text-sm font-semibold text-card-foreground">执行日志</h3>
      </div>
      <div className="flex flex-col gap-0 divide-y">
        {logs.map((log) => (
          <div
            key={log.id}
            className={cn(
              "flex items-start gap-3 px-4 py-3",
              log.status === "error" && "bg-destructive/5"
            )}
          >
            <div className="mt-0.5 shrink-0">{logIcon(log.status)}</div>
            <div className="flex flex-1 flex-col gap-0.5">
              <span className="text-xs font-medium text-muted-foreground">
                {log.event}
              </span>
              <span className="text-sm text-card-foreground">{log.summary}</span>
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
              {log.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
