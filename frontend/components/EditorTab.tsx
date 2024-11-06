"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Loader2, FileIcon, FolderIcon } from "lucide-react";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const languages = ["javascript", "python", "bash"]

const dummyFileStructure = [
  {
    "filename": "README.md",
    "content": "# Simple Python Project\n\nThis is a simple Python project example."
  },
  {
    "filename": "requirements.txt",
    "content": "requests==2.25.1\nflask==1.1.2"
  },
  {
    "filename": ".gitignore",
    "content": "__pycache__/\n.env\n*.pyc\n"
  },
  {
    "filename": "main.py",
    "content": "from src.module import example_function\n\nif __name__ == '__main__':\n    example_function()"
  },
  {
    "filename": "config/settings.py",
    "content": "import os\n\nDEBUG = os.getenv('DEBUG', True)\nDATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')"
  },
  {
    "filename": "src/__init__.py",
    "content": "# Initialize the src package\n"
  },
  {
    "filename": "src/module.py",
    "content": "def example_function():\n    print('This is an example function.')\n"
  },
  {
    "filename": "tests/test_module.py",
    "content": "from src.module import example_function\n\ndef test_example_function():\n    assert example_function() is None"
  },
  {
    "filename": "docs/usage.md",
    "content": "# Usage\n\nTo use this project, run:\n\n```bash\npython main.py\n```"
  },
  {
    "filename": "scripts/setup.sh",
    "content": "#!/bin/bash\n\n# Set up virtual environment\npython3 -m venv env\nsource env/bin/activate\npip install -r requirements.txt"
  }
];

function createFileTree(files) {
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

export default function EditorTab() {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("# Write your code here");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const fileTree = createFileTree(dummyFileStructure);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [output]);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || "");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("Running code...\n");
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Set logic for running code here (can be failure)
    setOutput((prev) => prev + "Code execution completed.\nOutput: Hello, World!");
    setIsRunning(false);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setCode(file.content);
    setLanguage(file.name.endsWith('.py') ? 'python' : 'javascript');
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
          <h2 className="text-lg font-semibold mb-2 text-[#c9d1d9]">Console Output</h2>
          <pre className="font-mono text-sm whitespace-pre-wrap text-[#8b949e]">{output}</pre>
        </div>
      </div>
    </div>
  );
}