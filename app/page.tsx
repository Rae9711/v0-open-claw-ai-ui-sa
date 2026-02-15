"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { WorkbenchPage } from "@/components/workbench/workbench-page"
import { PersonalityPage } from "@/components/personality/personality-page"
import { TaskCenterPage } from "@/components/tasks/task-center-page"

type PageKey = "workbench" | "personality" | "tasks"

export default function Home() {
  const [activePage, setActivePage] = useState<PageKey>("workbench")

  return (
    <AppShell activePage={activePage} onNavigate={setActivePage}>
      {activePage === "workbench" && <WorkbenchPage />}
      {activePage === "personality" && <PersonalityPage />}
      {activePage === "tasks" && <TaskCenterPage />}
    </AppShell>
  )
}
