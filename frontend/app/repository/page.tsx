"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CircleDot, FileCode, GitPullRequest, Play, Square } from "lucide-react"
import EditorTab from "@/components/EditorTab"
import IssueTab from "@/components/IssueTab"

const apiBaseUrl = "http://localhost:8080/api"

export default function RepositoryPage() {
  const [isRecording, setIsRecording] = useState(false)
  const [repository, setRepository] = useState(null);
  const [issue, setIssue] = useState([]);
  const [fileStructure, setFileStructure] = useState([]);

  const toggleRecording = () => {
    if (!isRecording) {
      startSession();
    } else {
      endSession();
    }
    setIsRecording(!isRecording);
  };

  const startSession = async () => {
    await fetch(`${apiBaseUrl}/trace/start-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issue: issue.issue, initial_code: "<initial code here>" })  
    });
  };

  const endSession = async () => {
    await fetch(`${apiBaseUrl}/trace/end-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pull_request: "<pull request details here>" }) 
    }).then(() => alert("Traces Saved Successfully! 🎉"));
  };

  // fetch repository data
  useEffect(() => {
    fetch(`${apiBaseUrl}/repository/random`)
      .then((res) => res.json())
      .then((data) => {
        setRepository(data);
        setIssue(data.issue);
        setFileStructure(data.repository);
      });
  }, [])

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
            className={`flex items-center ${isRecording
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
            <IssueTab issue={issue}/>
          </TabsContent>
          <TabsContent value="editor">
          <EditorTab
              fileStructure={fileStructure}
              setFileStructure={setFileStructure}
              isRecording={isRecording}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}