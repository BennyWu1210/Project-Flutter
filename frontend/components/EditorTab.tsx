"use client";

import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react";

const languages = ["javascript", "python"]

export default function EditorTab() {

  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(language === "python" ? "# Write your code here" : "// Write your code here");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [output])

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "")
  }

  const handleRun = async () => {
    setIsRunning(true)
    setOutput("Running code...\n")
    // Simulate code execution
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setOutput((prev) => prev + "Code execution completed.\nOutput: Hello, World!")
    setIsRunning(false)
  }

  return <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
    <div className="flex items-center justify-between mb-4">
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-[180px] bg-[#161b22] border-[#30363d]">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent className="bg-[#161b22] border-[#30363d]">
          {languages.map((lang) => (
            <SelectItem key={lang} value={lang} className="hover:bg-[#30363d]">
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={handleRun}
        disabled={isRunning}
        className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 h-9 rounded-md transition-colors duration-200"
      >
        {isRunning ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )}
        {isRunning ? "Running" : "Run Code"}
      </Button>
    </div>
    <div className="flex flex-col lg:flex-row h-[calc(100vh-300px)]">
      <div className="w-7/12 mb-4 lg:mb-0 lg:mr-4">
        <Editor
          language={language}
          theme="vs-dark"
          value={code}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            padding: { top: 16 },
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              useShadows: false,
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
          onChange={handleEditorChange}
          className="h-full border border-[#30363d] rounded-md overflow-hidden"
        />
      </div>
      <div className="w-5/12 bg-[#0d1117] border border-[#30363d] rounded-md p-4 overflow-auto" ref={consoleRef}>
        <h2 className="text-lg font-semibold mb-2">Console Output</h2>
        <pre className="font-mono text-sm whitespace-pre-wrap text-[#8b949e]">{output}</pre>
      </div>
    </div>
  </div>

}