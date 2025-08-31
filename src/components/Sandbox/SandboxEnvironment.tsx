import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Share, 
  Terminal, 
  Code, 
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Database,
  Settings,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  FileText,
  Folder,
  Plus,
  Save,
  Upload,
  GitBranch,
  Package
} from 'lucide-react';

interface SandboxFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: string;
  isModified: boolean;
}

interface SandboxEnvironment {
  id: string;
  name: string;
  language: string;
  framework: string;
  status: 'idle' | 'running' | 'building' | 'error';
  url?: string;
  lastModified: Date;
  isSecure: boolean;
  password?: string;
  files: SandboxFile[];
  dependencies: string[];
  buildLogs: string[];
}

interface SandboxEnvironmentProps {
  projectId?: string;
  onEnvironmentChange?: (env: SandboxEnvironment) => void;
  onCodeGenerated?: (code: string, files: SandboxFile[]) => void;
}

const SandboxEnvironment = ({ projectId, onEnvironmentChange, onCodeGenerated }: SandboxEnvironmentProps) => {
  const [environments, setEnvironments] = useState<SandboxEnvironment[]>([
    {
      id: 'react-web',
      name: 'React Web App',
      language: 'typescript',
      framework: 'react',
      status: 'idle',
      lastModified: new Date(),
      isSecure: false,
      files: [
        {
          id: 'app-tsx',
          name: 'App.tsx',
          path: '/src/App.tsx',
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

export default App;`,
          language: 'typescript',
          isModified: false
        }
      ],
      dependencies: ['react', 'react-dom', '@types/react', 'vite', 'tailwindcss'],
      buildLogs: []
    },
    {
      id: 'react-native',
      name: 'React Native App',
      language: 'typescript',
      framework: 'react-native',
      status: 'idle',
      lastModified: new Date(),
      isSecure: true,
      files: [
        {
          id: 'app-native',
          name: 'App.tsx',
          path: '/App.tsx',
          content: `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Vortex Mobile</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});`,
          language: 'typescript',
          isModified: false
        }
      ],
      dependencies: ['react-native', '@types/react', '@types/react-native', 'expo'],
      buildLogs: []
    },
    {
      id: 'node-backend',
      name: 'Node.js Backend',
      language: 'typescript',
      framework: 'express',
      status: 'idle',
      lastModified: new Date(),
      isSecure: false,
      files: [
        {
          id: 'server-ts',
          name: 'server.ts',
          path: '/src/server.ts',
          content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/vortex', (req, res) => {
  res.json({ 
    message: 'Vortex Backend API',
    version: '1.0.0',
    features: ['AI Integration', 'Real-time Data', 'Secure Auth']
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 Vortex Backend running on port \${PORT}\`);
});`,
          language: 'typescript',
          isModified: false
        }
      ],
      dependencies: ['express', '@types/express', 'cors', 'helmet', 'typescript', 'ts-node'],
      buildLogs: []
    }
  ]);

  const [selectedEnv, setSelectedEnv] = useState<string>('react-web');
  const [selectedFile, setSelectedFile] = useState<string>('app-tsx');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    '$ npm install',
    'Installing dependencies...',
    '✓ Dependencies installed successfully',
    '$ npm run dev',
    '✓ Development server started'
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentEnv = environments.find(env => env.id === selectedEnv);
  const currentFile = currentEnv?.files.find(file => file.id === selectedFile);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleRunEnvironment = async (envId: string) => {
    const password = generateSecurePassword();
    
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { 
            ...env, 
            status: 'building',
            password: env.isSecure ? password : undefined,
            buildLogs: ['Starting build process...', 'Installing dependencies...']
          }
        : env
    ));

    // Simulate realistic build process
    const buildSteps = [
      'Analyzing project structure...',
      'Installing dependencies...',
      'Compiling TypeScript...',
      'Building assets...',
      'Starting development server...',
      '✓ Build completed successfully!'
    ];

    for (let i = 0; i < buildSteps.length; i++) {
      setTimeout(() => {
        setEnvironments(prev => prev.map(env => 
          env.id === envId 
            ? { 
                ...env, 
                buildLogs: [...env.buildLogs, buildSteps[i]]
              }
            : env
        ));
      }, (i + 1) * 500);
    }

    // Complete build
    setTimeout(() => {
      setEnvironments(prev => prev.map(env => 
        env.id === envId 
          ? { 
              ...env, 
              status: 'running', 
              url: `https://sandbox-${envId}-${Date.now()}.vortex.dev`,
              lastModified: new Date()
            }
          : env
      ));
      
      const updatedEnv = environments.find(e => e.id === envId);
      if (updatedEnv && onEnvironmentChange) {
        onEnvironmentChange(updatedEnv);
      }
    }, 3000);
  };

  const handleStopEnvironment = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status: 'idle', url: undefined, password: undefined }
        : env
    ));
  };

  const handleFileContentChange = (fileId: string, newContent: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === selectedEnv
        ? {
            ...env,
            files: env.files.map(file =>
              file.id === fileId
                ? { ...file, content: newContent, isModified: true }
                : file
            )
          }
        : env
    ));

    if (onCodeGenerated && currentEnv) {
      onCodeGenerated(newContent, currentEnv.files);
    }
  };

  const handleTerminalCommand = (command: string) => {
    const newHistory = [...terminalHistory, `$ ${command}`];
    
    // Simulate command responses
    if (command.includes('npm install')) {
      newHistory.push('Installing dependencies...', '✓ Dependencies installed');
    } else if (command.includes('npm run')) {
      newHistory.push('Starting development server...', '✓ Server running on http://localhost:3000');
    } else if (command.includes('git')) {
      newHistory.push('Git command executed successfully');
    } else {
      newHistory.push(`Command executed: ${command}`);
    }
    
    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px', scale: '0.8' };
      case 'tablet':
        return { width: '768px', height: '1024px', scale: '0.7' };
      default:
        return { width: '100%', height: '100%', scale: '1' };
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Sandbox Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Live Sandbox Environment</h2>
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {environments.map(env => (
                  <SelectItem key={env.id} value={env.id}>
                    <div className="flex items-center gap-2">
                      {env.framework === 'react' && <Globe className="w-4 h-4 text-blue-500" />}
                      {env.framework === 'react-native' && <Smartphone className="w-4 h-4 text-green-500" />}
                      {env.framework === 'express' && <Database className="w-4 h-4 text-purple-500" />}
                      {env.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {currentEnv?.isSecure && currentEnv?.password && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Lock className="w-3 h-3 mr-1" />
                Password: {currentEnv.password}
              </Badge>
            )}
            
            <Badge variant={currentEnv?.status === 'running' ? 'default' : 
                           currentEnv?.status === 'building' ? 'secondary' : 'outline'}>
              {currentEnv?.status}
            </Badge>

            {currentEnv?.status === 'idle' && (
              <Button 
                size="sm" 
                onClick={() => handleRunEnvironment(selectedEnv)}
                className="bg-gradient-primary"
              >
                <Play className="w-4 h-4 mr-1" />
                Run Environment
              </Button>
            )}

            {currentEnv?.status === 'running' && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => handleStopEnvironment(selectedEnv)}
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStopEnvironment(selectedEnv)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>

            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <Terminal className="w-4 h-4 mr-1" />
              Terminal
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer & Controls */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur flex flex-col">
          {/* File Explorer */}
          <div className="flex-1">
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm">Project Files</h3>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2">
                {currentEnv?.files.map(file => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 py-2 px-3 hover:bg-accent/50 cursor-pointer rounded text-sm ${
                      selectedFile === file.id ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => setSelectedFile(file.id)}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="flex-1">{file.name}</span>
                    {file.isModified && (
                      <div className="w-2 h-2 bg-primary rounded-full" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {file.language}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Environment Info */}
          <div className="p-3 border-t border-border">
            <h4 className="text-sm font-medium mb-2">Environment Info</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Framework:</span>
                <span className="font-medium">{currentEnv?.framework}</span>
              </div>
              <div className="flex justify-between">
                <span>Language:</span>
                <span className="font-medium">{currentEnv?.language}</span>
              </div>
              <div className="flex justify-between">
                <span>Dependencies:</span>
                <span className="font-medium">{currentEnv?.dependencies.length}</span>
              </div>
              {currentEnv?.url && (
                <div className="pt-2 border-t border-border">
                  <span className="text-primary text-xs break-all">{currentEnv.url}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor & Preview */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="p-3 border-b border-border bg-card/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentFile?.name || 'No file selected'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Save className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Upload className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={previewMode} onValueChange={(value: any) => setPreviewMode(value)}>
                  <SelectTrigger className="w-32 h-7">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desktop">
                      <div className="flex items-center gap-2">
                        <Monitor className="w-3 h-3" />
                        Desktop
                      </div>
                    </SelectItem>
                    <SelectItem value="tablet">
                      <div className="flex items-center gap-2">
                        <Tablet className="w-3 h-3" />
                        Tablet
                      </div>
                    </SelectItem>
                    <SelectItem value="mobile">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-3 h-3" />
                        Mobile
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Button size="sm" variant="outline">
                  <Share className="w-3 h-3 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Split View: Editor + Preview */}
          <div className="flex-1 flex">
            {/* Code Editor */}
            <div className="w-1/2 border-r border-border">
              <div className="h-full flex flex-col">
                <div className="p-3 border-b border-border bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Code Editor</span>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <Textarea
                    value={currentFile?.content || ''}
                    onChange={(e) => currentFile && handleFileContentChange(currentFile.id, e.target.value)}
                    className="w-full h-full border-none resize-none font-mono text-sm p-4 bg-background"
                    placeholder="Select a file to start editing..."
                  />
                  
                  {/* AI Code Assistant */}
                  <div className="absolute top-4 right-4">
                    <Card className="w-56 bg-card/90 backdrop-blur border-border">
                      <CardContent className="p-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            AI analyzing...
                          </div>
                          <div className="space-y-1">
                            <p className="text-primary">💡 Suggestion:</p>
                            <p className="text-muted-foreground">
                              Add TypeScript interfaces for better type safety
                            </p>
                          </div>
                          <Button size="sm" className="w-full text-xs bg-gradient-primary">
                            Apply AI Fix
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="w-1/2 flex flex-col">
              <div className="p-3 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Live Preview</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button 
                      size="sm" 
                      variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                      onClick={() => setPreviewMode('desktop')}
                      className="h-6 w-6 p-0"
                    >
                      <Monitor className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                      onClick={() => setPreviewMode('tablet')}
                      className="h-6 w-6 p-0"
                    >
                      <Tablet className="w-3 h-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                      onClick={() => setPreviewMode('mobile')}
                      className="h-6 w-6 p-0"
                    >
                      <Smartphone className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 bg-muted/10 flex items-center justify-center">
                <div 
                  className="bg-background border border-border rounded-lg overflow-hidden shadow-lg transition-all duration-300"
                  style={getPreviewDimensions()}
                >
                  {currentEnv?.status === 'running' && currentEnv.url ? (
                    <iframe
                      ref={iframeRef}
                      src={currentEnv.url}
                      className="w-full h-full"
                      title={`${currentEnv.name} Preview`}
                    />
                  ) : currentEnv?.status === 'building' ? (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Building {currentEnv.name}...</p>
                        {currentEnv.buildLogs.length > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {currentEnv.buildLogs[currentEnv.buildLogs.length - 1]}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Environment not running</p>
                        <Button 
                          size="sm" 
                          onClick={() => handleRunEnvironment(selectedEnv)}
                          className="bg-gradient-primary"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start {currentEnv?.name}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-64 border-t border-border bg-black/95 text-green-400 font-mono text-sm">
              <div className="p-3 border-b border-border/50 bg-black/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4" />
                    <span className="text-xs">Terminal - {currentEnv?.name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowTerminal(false)}
                    className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
                  >
                    <EyeOff className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-3" ref={terminalRef}>
                  <div className="space-y-1">
                    {terminalHistory.map((line, index) => (
                      <div key={index} className={line.startsWith('$') ? 'text-green-400' : 'text-gray-300'}>
                        {line}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                <div className="p-3 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <Input
                      value={terminalInput}
                      onChange={(e) => setTerminalInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && terminalInput.trim()) {
                          handleTerminalCommand(terminalInput);
                        }
                      }}
                      className="bg-transparent border-none text-green-400 placeholder-green-600/50 focus-visible:ring-0"
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SandboxEnvironment;