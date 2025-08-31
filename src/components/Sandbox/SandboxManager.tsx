import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  EyeOff
} from 'lucide-react';

interface SandboxEnvironment {
  id: string;
  name: string;
  language: string;
  framework: string;
  status: 'idle' | 'running' | 'building' | 'error';
  url?: string;
  lastModified: Date;
  isSecure: boolean;
}

interface SandboxManagerProps {
  projectId?: string;
  onEnvironmentChange?: (env: SandboxEnvironment) => void;
}

const SandboxManager = ({ projectId, onEnvironmentChange }: SandboxManagerProps) => {
  const [environments, setEnvironments] = useState<SandboxEnvironment[]>([
    {
      id: 'web-react',
      name: 'React Web App',
      language: 'typescript',
      framework: 'react',
      status: 'idle',
      lastModified: new Date(),
      isSecure: false
    },
    {
      id: 'mobile-rn',
      name: 'React Native',
      language: 'typescript',
      framework: 'react-native',
      status: 'idle',
      lastModified: new Date(),
      isSecure: true
    },
    {
      id: 'backend-node',
      name: 'Node.js Backend',
      language: 'typescript',
      framework: 'express',
      status: 'idle',
      lastModified: new Date(),
      isSecure: false
    }
  ]);

  const [selectedEnv, setSelectedEnv] = useState<string>('web-react');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTerminal, setShowTerminal] = useState(false);
  const [sessionPassword, setSessionPassword] = useState<string>('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentEnv = environments.find(env => env.id === selectedEnv);

  const handleRunEnvironment = async (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status: 'building' }
        : env
    ));

    // Simulate build process
    setTimeout(() => {
      setEnvironments(prev => prev.map(env => 
        env.id === envId 
          ? { 
              ...env, 
              status: 'running', 
              url: `https://sandbox-${envId}.vortex.dev`,
              lastModified: new Date()
            }
          : env
      ));
    }, 2000);
  };

  const handleStopEnvironment = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status: 'idle', url: undefined }
        : env
    ));
  };

  const handleResetEnvironment = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status: 'idle', url: undefined, lastModified: new Date() }
        : env
    ));
  };

  const generateSessionPassword = () => {
    const password = Math.random().toString(36).substring(2, 15);
    setSessionPassword(password);
    setIsPasswordProtected(true);
    return password;
  };

  const getPreviewDimensions = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Sandbox Header */}
      <div className="p-4 border-b border-border bg-card/50 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Sandbox Environments</h2>
            <Select value={selectedEnv} onValueChange={setSelectedEnv}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {environments.map(env => (
                  <SelectItem key={env.id} value={env.id}>
                    <div className="flex items-center gap-2">
                      {env.framework === 'react' && <Globe className="w-4 h-4" />}
                      {env.framework === 'react-native' && <Smartphone className="w-4 h-4" />}
                      {env.framework === 'express' && <Database className="w-4 h-4" />}
                      {env.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {currentEnv?.isSecure && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                <Lock className="w-3 h-3 mr-1" />
                Secure Session
              </Badge>
            )}
            
            <Badge variant={currentEnv?.status === 'running' ? 'default' : 'secondary'}>
              {currentEnv?.status}
            </Badge>

            {currentEnv?.status === 'idle' && (
              <Button 
                size="sm" 
                onClick={() => handleRunEnvironment(selectedEnv)}
                className="bg-gradient-primary"
              >
                <Play className="w-4 h-4 mr-1" />
                Run
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
              onClick={() => handleResetEnvironment(selectedEnv)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sandbox Controls */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur">
          <Tabs defaultValue="environments" className="h-full">
            <TabsList className="w-full">
              <TabsTrigger value="environments" className="flex-1">Environments</TabsTrigger>
              <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="environments" className="p-4 space-y-4">
              <div className="space-y-3">
                {environments.map(env => (
                  <Card 
                    key={env.id} 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedEnv === env.id 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-card/70'
                    }`}
                    onClick={() => setSelectedEnv(env.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {env.framework === 'react' && <Globe className="w-4 h-4 text-blue-500" />}
                        {env.framework === 'react-native' && <Smartphone className="w-4 h-4 text-green-500" />}
                        {env.framework === 'express' && <Database className="w-4 h-4 text-purple-500" />}
                        <span className="font-medium text-sm">{env.name}</span>
                      </div>
                      {env.isSecure && <Lock className="w-3 h-3 text-yellow-500" />}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{env.language} • {env.framework}</span>
                      <Badge 
                        variant={env.status === 'running' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {env.status}
                      </Badge>
                    </div>

                    {env.url && (
                      <div className="mt-2 text-xs text-primary truncate">
                        {env.url}
                      </div>
                    )}
                  </Card>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="text-xs">
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={() => setShowTerminal(!showTerminal)}
                  >
                    <Terminal className="w-3 h-3 mr-1" />
                    Terminal
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs"
                    onClick={generateSessionPassword}
                  >
                    <Lock className="w-3 h-3 mr-1" />
                    Secure
                  </Button>
                </div>
              </div>

              {isPasswordProtected && sessionPassword && (
                <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
                  <div className="text-xs">
                    <div className="font-medium text-yellow-600 mb-1">Session Password:</div>
                    <code className="text-yellow-700 bg-yellow-100/50 px-2 py-1 rounded">
                      {sessionPassword}
                    </code>
                    <div className="text-yellow-600 mt-1">
                      Share this password for secure collaboration
                    </div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="p-4 space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Preview Mode</label>
                  <Select value={previewMode} onValueChange={(value: any) => setPreviewMode(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desktop">
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          Desktop
                        </div>
                      </SelectItem>
                      <SelectItem value="tablet">
                        <div className="flex items-center gap-2">
                          <Tablet className="w-4 h-4" />
                          Tablet
                        </div>
                      </SelectItem>
                      <SelectItem value="mobile">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" />
                          Mobile
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Language Runtime</label>
                  <Select defaultValue="typescript">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="rust">Rust</SelectItem>
                      <SelectItem value="go">Go</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Framework</label>
                  <Select defaultValue="react">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                      <SelectItem value="angular">Angular</SelectItem>
                      <SelectItem value="solid">Solid.js</SelectItem>
                      <SelectItem value="next">Next.js</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Security Options</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start text-xs"
                      onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                    >
                      {isPasswordProtected ? <Lock className="w-3 h-3 mr-2" /> : <Unlock className="w-3 h-3 mr-2" />}
                      {isPasswordProtected ? 'Disable' : 'Enable'} Password Protection
                    </Button>
                    <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                      <Eye className="w-3 h-3 mr-2" />
                      Session Audit Log
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Area */}
        <div className="flex-1 flex flex-col">
          {/* Preview Controls */}
          <div className="p-3 border-b border-border bg-card/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Monitor className="w-4 h-4 mr-1" />
                  Desktop
                </Button>
                <Button size="sm" variant="ghost">
                  <Tablet className="w-4 h-4 mr-1" />
                  Tablet
                </Button>
                <Button size="sm" variant="ghost">
                  <Smartphone className="w-4 h-4 mr-1" />
                  Mobile
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {currentEnv?.url && (
                  <Badge variant="secondary" className="text-xs">
                    {currentEnv.url}
                  </Badge>
                )}
                <Button size="sm" variant="outline">
                  <Share className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Frame */}
          <div className="flex-1 p-6 bg-muted/20">
            <div 
              className="mx-auto bg-background border border-border rounded-lg overflow-hidden shadow-lg"
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
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Building {currentEnv.name}...</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
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

          {/* Terminal */}
          {showTerminal && (
            <div className="h-64 border-t border-border bg-black/90 text-green-400 font-mono text-sm">
              <div className="p-3 border-b border-border/50 bg-black/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Terminal - {currentEnv?.name}</span>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setShowTerminal(false)}
                    className="h-6 w-6 p-0"
                  >
                    <EyeOff className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <ScrollArea className="h-full p-3">
                <div className="space-y-1">
                  <div>$ npm install</div>
                  <div className="text-gray-400">Installing dependencies...</div>
                  <div>$ npm run dev</div>
                  <div className="text-gray-400">Starting development server...</div>
                  <div className="text-green-400">✓ Server running on http://localhost:3000</div>
                  <div className="flex items-center">
                    <span>$ </span>
                    <input 
                      type="text" 
                      className="bg-transparent border-none outline-none flex-1 ml-1"
                      placeholder="Enter command..."
                    />
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SandboxManager;