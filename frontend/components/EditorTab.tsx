"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2, FileIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const languages = ["javascript", "python", "bash"]
const apiBaseUrl = "http://localhost:8080/api"

// Function to create file tree structure
function createFileTree(files: any[]) {
  const root = { name: 'root', children: {} };

  files.forEach(file => {
    const parts = file.filename.split('/');
    let current = root;

    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = { name: part, children: {} };
        if (index === parts.length - 1) {
          current.children[part].content = file.content;
        }
      }
      current = current.children[part];
    });
  });

  return root;
}

function FileTree({ node, onSelect, level = 0 }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = Object.keys(node.children).length > 0;

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div
        className={`flex items-center cursor-pointer py-1 px-2 rounded hover:bg-[#30363d] ${hasChildren ? 'font-semibold' : ''}`}
        onClick={() => {
          if (hasChildren) {
            setIsOpen(!isOpen);
          } else {
            onSelect(node);
          }
        }}
      >
        {hasChildren ? (
          <FolderIcon className="w-4 h-4 mr-2 text-[#8b949e]" />
        ) : (
          <FileIcon className="w-4 h-4 mr-2 text-[#8b949e]" />
        )}
        <span className="text-[#c9d1d9]">{node.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div>
          {Object.values(node.children).map((child, index) => (
            <FileTree key={index} node={child} onSelect={onSelect} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}


export default function EditorTab({ fileStructure, setFileStructure, isRecording }: { fileStructure: any[], setFileStructure: any, isRecording: boolean }) {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Write your code here");
  const [edited, setEdited] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const fileTree = createFileTree(fileStructure);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
    setEdited(true);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    updateFileContent(code);

    fetch(`${apiBaseUrl}/code/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    })
      .then((res) => res.json())
      .then((data) => {
        setOutput("Code execution result: \n" + data.console);

        if (isRecording) {
          if (edited) {
            recordTrace("edit_code", { diff: "+++ print(\"Hello World\")" });
          }
          recordTrace("execute_code", { execution_result: data.result });
        }
      })
    setIsRunning(false);
    setEdited(false);
  };

  const recordTrace = async (action, details) => {
    await fetch(`${apiBaseUrl}/trace/record`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...details })
    });
  };


  // Incomplete logic due to complex logic for file selection
  const handleFileSelect = (file) => {
    updateFileContent(code);
    setSelectedFile(file);
    setCode(file.content);
    setEdited(false);
    setLanguage(file.name.endsWith('.py') ? 'python' : 'javascript');
  };


  const updateFileContent = (content) => {
    if (!selectedFile) return;

    const newFileStructure = fileStructure.map(file => {
      if (file.filename === selectedFile.name) {
        return { ...file, content: content };
      }
      return file;
    });

    setFileStructure(newFileStructure);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-[#21262d] text-[#c9d1d9] border-[#30363d] hover:bg-[#30363d]">
                Select File
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#161b22] border-[#30363d] text-[#c9d1d9]">
              <DialogHeader>
                <DialogTitle>Select a File</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[400px] w-full pr-4">
                <FileTree node={fileTree} onSelect={handleFileSelect} />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
        <Button
          onClick={handleRun}
          disabled={isRunning}
          className="bg-black hover:bg-gray-500 text-white px-6 h-9 rounded-full transition-colors duration-200 border-blue-500 border"
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
          <h2 className="text-lg font-semibold mb-2 text-[#c9d1d9]">Console Output</h2>
          <pre className="font-mono text-sm whitespace-pre-wrap text-[#8b949e]">{output}</pre>
        </div>
      </div>
    </div>
  );
}