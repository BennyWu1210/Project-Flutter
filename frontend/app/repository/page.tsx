"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CircleDot, FileCode, GitPullRequest, Play, Square } from "lucide-react"
import EditorTab from "@/components/EditorTab"



export default function RepositoryPage() {
  const [isRecording, setIsRecording] = useState(false)
  

  

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }


  

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <header className="bg-[#161b22] border-b border-[#30363d] p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <CircleDot className="mr-2 text-[#238636]" />
            Project Flutter
          </h1>
          <Button
            onClick={toggleRecording}
            variant={isRecording ? "destructive" : "default"}
            className={`flex items-center ${
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-[#238636] hover:bg-[#2ea043]"
            }`}
          >
            {isRecording ? (
              <>
                <Square className="mr-2 h-4 w-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto mt-6 px-4">
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="issues" className="flex items-center">
              <GitPullRequest className="mr-2 h-4 w-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center">
              <FileCode className="mr-2 h-4 w-4" />
              Editor
            </TabsTrigger>
          </TabsList>
          <TabsContent value="issues">
            <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
              <h2 className="text-lg font-semibold mb-4">Issues</h2>
              <p>Issues list will be displayed here.</p>
            </div>
          </TabsContent>
          <TabsContent value="editor">
            <EditorTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}