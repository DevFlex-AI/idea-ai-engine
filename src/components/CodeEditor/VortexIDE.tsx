import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  FileText, 
  Folder, 
  FolderOpen, 
  Plus, 
  Save, 
  Undo, 
  Redo, 
  Search, 
  Settings,
  Play,
  Bug,
  GitBranch,
  Users,
  Lock,
  Eye,
  Code2,
  Terminal,
  Palette,
  Zap
} from 'lucide-react';

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  isOpen?: boolean;
  language?: string;
}

interface VortexIDEProps {
  projectId?: string;
  onCodeChange?: (code: string) => void;
}

const VortexIDE = ({ projectId, onCodeChange }: VortexIDEProps) => {
  const [fileTree, setFileTree] = useState<FileNode[]>([
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: 'app.tsx',
          name: 'App.tsx',
          type: 'file',
          language: 'typescript',
          content: `import React from 'react';
import { Button } from './components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Welcome to Vortex
          </h1>
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;`
        },
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          isOpen: false,
          children: [
            {
              id: 'button.tsx',
              name: 'Button.tsx',
              type: 'file',
              language: 'typescript',
              content: `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  onClick 
}) => {
  return (
    <button
      className={\`px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 \${className}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`
            }
          ]
        }
      ]
    }
  ]);

  const [selectedFile, setSelectedFile] = useState<string>('app.tsx');
  const [code, setCode] = useState<string>('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [collaborators, setCollaborators] = useState([
    { id: '1', name: 'AI Agent', avatar: '🤖', status: 'active' },
    { id: '2', name: 'You', avatar: '👤', status: 'active' }
  ]);

  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const selectedFileNode = findFileById(fileTree, selectedFile);
    if (selectedFileNode && selectedFileNode.content) {
      setCode(selectedFileNode.content);
    }
  }, [selectedFile, fileTree]);

  const findFileById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const toggleFolder = (folderId: string) => {
    const updateNodes = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === folderId && node.type === 'folder') {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNodes(node.children) };
        }
        return node;
      });
    };
    setFileTree(updateNodes(fileTree));
  };

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div 
          className={`flex items-center gap-2 py-1 px-2 hover:bg-accent/50 cursor-pointer rounded text-sm ${
            selectedFile === node.id ? 'bg-accent text-accent-foreground' : ''
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setSelectedFile(node.id);
            }
          }}
        >
          {node.type === 'folder' ? (
            node.isOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>{node.name}</span>
          {node.type === 'file' && node.language && (
            <Badge variant="outline" className="text-xs ml-auto">
              {node.language}
            </Badge>
          )}
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>
            {renderFileTree(node.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  return (
    <div className="h-full flex bg-background">
      {/* File Explorer */}
      <div className="w-64 border-r border-border bg-card/30 backdrop-blur">
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">Explorer</h3>
            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
              <Plus className="w-3 h-3" />
            </Button>
          </div>
          <Input 
            placeholder="Search files..." 
            className="h-7 text-xs"
          />
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {renderFileTree(fileTree)}
          </div>
        </ScrollArea>

        {/* Collaborators */}
        <div className="p-3 border-t border-border">
          <h4 className="text-xs font-medium mb-2 flex items-center">
            <Users className="w-3 h-3 mr-1" />
            Live Collaborators
          </h4>
          <div className="space-y-1">
            {collaborators.map(collab => (
              <div key={collab.id} className="flex items-center gap-2 text-xs">
                <span className="text-sm">{collab.avatar}</span>
                <span>{collab.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  collab.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="p-3 border-b border-border bg-card/30 backdrop-blur">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {findFileById(fileTree, selectedFile)?.name || 'No file selected'}
              </Badge>
              {isPasswordProtected && (
                <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-600">
                  <Lock className="w-3 h-3 mr-1" />
                  Protected
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Undo className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Redo className="w-3 h-3" />
              </Button>
              <Separator orientation="vertical" className="h-4 mx-1" />
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Save className="w-3 h-3" />
              </Button>
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                <Play className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 relative">
          <textarea
            ref={editorRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="w-full h-full p-4 bg-background border-none outline-none resize-none font-mono text-sm"
            placeholder="Start coding..."
            spellCheck={false}
          />
          
          {/* AI Assistant Overlay */}
          <div className="absolute top-4 right-4">
            <Card className="w-64 bg-card/90 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-primary" />
                  AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Analyzing code...
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary">💡 Suggestion:</p>
                    <p className="text-muted-foreground">
                      Add error boundaries for better error handling
                    </p>
                  </div>
                  <Button size="sm" className="w-full text-xs bg-gradient-primary">
                    Apply Fix
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <div className="p-2 border-t border-border bg-card/30 backdrop-blur">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>Line 1, Column 1</span>
              <span>TypeScript</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                main
              </span>
              <span className="flex items-center gap-1">
                <Bug className="w-3 h-3" />
                0 errors
              </span>
              <span>Auto-save: On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VortexIDE;