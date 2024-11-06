"use client"

import { AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"


export default function IssuesPage({issue}: {issue: string}) {
  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen p-6">
      <div className="w-full mx-auto">
        <div className="bg-[#161b22] border border-[#30363d] rounded-md">
          <div className="p-4 border-b border-[#30363d] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="text-[#3fb950] h-5 w-5" />
              <span className="font-medium">Open</span>
            </div>
            <Badge variant="outline" className="bg-[#238636] text-white border-[#238636]">
              1
            </Badge>
          </div>

          <div className="p-4">
            <h2 className="text-lg font-semibold text-[#58a6ff] mb-2">
              Urgent Issue on Production
            </h2>
            <p className="mb-3">Navigate to the <b>Editor</b> tab to get started with your fixes!</p>
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 mt-2">
              <p className="text-[#8b949e] whitespace-pre-wrap">{issue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}