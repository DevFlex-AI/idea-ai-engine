import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
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
  Package,
  Cpu,
  MemoryStick,
  Clock,
  Users,
  Shield,
  Layers,
  Code2
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
  status: 'idle' | 'running' | 'building' | 'error' | 'stopped';
  url?: string;
  password?: string;
  isSecure: boolean;
  files: SandboxFile[];
  dependencies: string[];
  buildLogs: string[];
  resourceLimits: {
    cpu: string;
    memory: string;
    timeout: string;
  };
  collaborators: string[];
  lastModified: Date;
}

interface LiveSandboxProps {
  projectId?: string;
  onEnvironmentChange?: (env: SandboxEnvironment) => void;
  onCodeGenerated?: (code: string, files: SandboxFile[]) => void;
}

const LiveSandbox = ({ projectId, onEnvironmentChange, onCodeGenerated }: LiveSandboxProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [environments, setEnvironments] = useState<SandboxEnvironment[]>([
    {
      id: 'react-web',
      name: 'React Web App',
      language: 'typescript',
      framework: 'react',
      status: 'idle',
      isSecure: false,
      files: [
        {
          id: 'app-tsx',
          name: 'App.tsx',
          path: '/src/App.tsx',
          content: `import React, { useState } from 'react';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Brain, Zap, Sparkles } from 'lucide-react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Welcome to Vortex
          </h1>
          <p className="text-xl text-purple-200 mb-8">
            AI-Powered Development Platform
          </p>
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Live Sandbox Environment
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                Interactive Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-4">{count}</div>
                <div className="space-x-2">
                  <Button 
                    onClick={() => setCount(count + 1)}
                    className="bg-gradient-to-r from-green-500 to-blue-500"
                  >
                    Increment
                  </Button>
                  <Button 
                    onClick={() => setCount(0)}
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Sandbox Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm">Live Hot Reload</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-sm">TypeScript Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full" />
                  <span className="text-sm">AI Code Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm">Secure Sessions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;`,
          language: 'typescript',
          isModified: false
        },
        {
          id: 'package-json',
          name: 'package.json',
          path: '/package.json',
          content: `{
  "name": "vortex-sandbox-app",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.462.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.23",
    "@types/react-dom": "^18.3.7",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.8.3",
    "vite": "^5.4.19",
    "tailwindcss": "^3.4.17",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6"
  }
}`,
          language: 'json',
          isModified: false
        }
      ],
      dependencies: ['react', 'react-dom', '@types/react', 'vite', 'tailwindcss'],
      buildLogs: [],
      resourceLimits: {
        cpu: '1 core',
        memory: '512MB',
        timeout: '30s'
      },
      collaborators: [],
      lastModified: new Date()
    },
    {
      id: 'react-native',
      name: 'React Native App',
      language: 'typescript',
      framework: 'react-native',
      status: 'idle',
      isSecure: true,
      files: [
        {
          id: 'app-native',
          name: 'App.tsx',
          path: '/App.tsx',
          content: `import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar,
  Animated
} from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const handlePress = () => {
    setCount(count + 1);
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.5, duration: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.header}>
        <Text style={styles.logo}>🧠</Text>
        <Text style={styles.title}>Vortex Mobile</Text>
        <Text style={styles.subtitle}>AI-Powered Development</Text>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.counterCard, { opacity: fadeAnim }]}>
          <Text style={styles.counterLabel}>Tap Counter</Text>
          <Text style={styles.counterValue}>{count}</Text>
          
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>⚡ Tap Me</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.resetButton]} 
            onPress={() => setCount(0)}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.featuresCard}>
          <Text style={styles.featuresTitle}>Sandbox Features</Text>
          <View style={styles.featuresList}>
            {[
              '🔥 Hot Reload',
              '📱 Native APIs',
              '🤖 AI Integration',
              '🔒 Secure Sessions'
            ].map((feature, index) => (
              <Text key={index} style={styles.featureItem}>{feature}</Text>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a78bfa',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  counterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  counterLabel: {
    fontSize: 18,
    color: '#a78bfa',
    marginBottom: 8,
  },
  counterValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    minWidth: 120,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  resetButtonText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 8,
  },
});`,
          language: 'typescript',
          isModified: false
        }
      ],
      dependencies: ['react-native', '@types/react', '@types/react-native', 'expo'],
      buildLogs: [],
      resourceLimits: {
        cpu: '2 cores',
        memory: '1GB',
        timeout: '60s'
      },
      collaborators: [],
      lastModified: new Date()
    },
    {
      id: 'node-backend',
      name: 'Node.js Backend',
      language: 'typescript',
      framework: 'express',
      status: 'idle',
      isSecure: false,
      files: [
        {
          id: 'server-ts',
          name: 'server.ts',
          path: '/src/server.ts',
          content: `import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// Vortex API endpoints
app.get('/api/vortex', (req, res) => {
  res.json({ 
    message: 'Vortex Backend API',
    version: '2.0.0',
    features: [
      'AI Integration',
      'Real-time Data',
      'Secure Auth',
      'Multi-tenant',
      'Auto-scaling',
      'Edge Functions'
    ],
    sandbox: {
      environment: 'production',
      language: 'typescript',
      framework: 'express'
    }
  });
});

// AI proxy endpoint
app.post('/api/ai/generate', async (req, res) => {
  try {
    const { prompt, model = 'gemini-pro' } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // This would integrate with your AI service
    const response = {
      generated: \`AI Response for: \${prompt}\`,
      model,
      tokens: Math.floor(Math.random() * 1000) + 100,
      timestamp: new Date().toISOString()
    };

    res.json(response);
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'AI generation failed' });
  }
});

// Sandbox management endpoints
app.get('/api/sandbox/environments', (req, res) => {
  res.json({
    environments: [
      { id: 'web', name: 'Web App', status: 'running' },
      { id: 'mobile', name: 'Mobile App', status: 'idle' },
      { id: 'backend', name: 'Backend API', status: 'running' }
    ]
  });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 Vortex Backend running on port \${PORT}\`);
  console.log(\`🔒 Security: Helmet + CORS + Rate Limiting enabled\`);
  console.log(\`🤖 AI: Ready for Gemini integration\`);
});`,
          language: 'typescript',
          isModified: false
        }
      ],
      dependencies: ['express', '@types/express', 'cors', 'helmet', 'express-rate-limit', 'typescript', 'ts-node'],
      buildLogs: [],
      resourceLimits: {
        cpu: '1 core',
        memory: '256MB',
        timeout: '30s'
      },
      collaborators: [],
      lastModified: new Date()
    },
    {
      id: 'python-ai',
      name: 'Python AI Service',
      language: 'python',
      framework: 'fastapi',
      status: 'idle',
      isSecure: true,
      files: [
        {
          id: 'main-py',
          name: 'main.py',
          path: '/main.py',
          content: `from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import json
from datetime import datetime
from typing import List, Optional

app = FastAPI(
    title="Vortex AI Service",
    description="Python-powered AI microservice for Vortex platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AIRequest(BaseModel):
    prompt: str
    model: str = "gemini-pro"
    max_tokens: int = 1000
    temperature: float = 0.7

class AIResponse(BaseModel):
    response: str
    model: str
    tokens_used: int
    processing_time_ms: int
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    timestamp: str
    version: str
    features: List[str]

@app.get("/", response_model=dict)
async def root():
    return {
        "message": "Vortex AI Service",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        version="1.0.0",
        features=[
            "AI Text Generation",
            "Multi-model Support", 
            "Real-time Processing",
            "Secure API",
            "Auto-scaling"
        ]
    )

@app.post("/ai/generate", response_model=AIResponse)
async def generate_ai_response(request: AIRequest):
    try:
        start_time = datetime.now()
        
        # Simulate AI processing
        # In production, this would call Gemini API
        ai_response = f"AI Generated Response for: {request.prompt}"
        
        processing_time = (datetime.now() - start_time).total_seconds() * 1000
        
        return AIResponse(
            response=ai_response,
            model=request.model,
            tokens_used=len(request.prompt) + len(ai_response),
            processing_time_ms=int(processing_time),
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}")

@app.get("/sandbox/info")
async def sandbox_info():
    return {
        "environment": "python-ai-service",
        "framework": "FastAPI",
        "features": [
            "Async/Await Support",
            "Automatic API Documentation", 
            "Type Validation",
            "CORS Enabled",
            "Production Ready"
        ],
        "endpoints": [
            {"path": "/", "method": "GET", "description": "Root endpoint"},
            {"path": "/health", "method": "GET", "description": "Health check"},
            {"path": "/ai/generate", "method": "POST", "description": "AI generation"},
            {"path": "/docs", "method": "GET", "description": "API documentation"}
        ]
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True,
        log_level="info"
    )`,
          language: 'python',
          isModified: false
        }
      ],
      dependencies: ['fastapi', 'uvicorn', 'pydantic', 'python-multipart'],
      buildLogs: [],
      resourceLimits: {
        cpu: '1 core',
        memory: '512MB',
        timeout: '45s'
      },
      collaborators: [],
      lastModified: new Date()
    }
  ]);

  const [selectedEnv, setSelectedEnv] = useState<string>('react-web');
  const [selectedFile, setSelectedFile] = useState<string>('app-tsx');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Vortex Sandbox Terminal',
    '$ vortex --version',
    'Vortex AI Builder v2.0.0',
    '$ npm --version',
    '10.2.4',
    '$ node --version', 
    'v20.11.0'
  ]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const currentEnv = environments.find(env => env.id === selectedEnv);
  const currentFile = currentEnv?.files.find(file => file.id === selectedFile);

  const generateSecurePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const createSandboxSession = async (envId: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase.rpc('create_sandbox_session', {
        p_user_id: user.id,
        p_project_id: projectId || null,
        p_environment_id: envId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sandbox session:', error);
      return null;
    }
  };

  const handleRunEnvironment = async (envId: string) => {
    const password = generateSecurePassword();
    
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { 
            ...env, 
            status: 'building',
            password: env.isSecure ? password : undefined,
            buildLogs: ['🚀 Starting Vortex Sandbox...', '📦 Installing dependencies...']
          }
        : env
    ));

    // Create secure session if needed
    if (currentEnv?.isSecure) {
      await createSandboxSession(envId);
    }

    // Realistic build process simulation
    const buildSteps = [
      '🔍 Analyzing project structure...',
      '📦 Installing dependencies...',
      '🔨 Compiling TypeScript...',
      '🎨 Processing assets...',
      '⚡ Starting development server...',
      '🔒 Configuring security...',
      '✅ Sandbox ready!'
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
      }, (i + 1) * 800);
    }

    // Complete build
    setTimeout(() => {
      const sandboxUrl = `https://sandbox-${envId}-${Date.now()}.vortex.dev`;
      
      setEnvironments(prev => prev.map(env => 
        env.id === envId 
          ? { 
              ...env, 
              status: 'running', 
              url: sandboxUrl,
              lastModified: new Date()
            }
          : env
      ));
      
      toast({
        title: "Sandbox Ready!",
        description: `${currentEnv?.name} is now running at ${sandboxUrl}`,
      });

      // Track usage
      if (user) {
        supabase.rpc('increment_usage', {
          p_user_id: user.id,
          p_resource_type: 'sandbox_time',
          p_amount: 1
        });
      }
      
    }, 6000);
  };

  const handleStopEnvironment = (envId: string) => {
    setEnvironments(prev => prev.map(env => 
      env.id === envId 
        ? { ...env, status: 'stopped', url: undefined, password: undefined }
        : env
    ));

    toast({
      title: "Sandbox Stopped",
      description: "Environment has been safely terminated",
    });
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
            ),
            lastModified: new Date()
          }
        : env
    ));

    if (onCodeGenerated && currentEnv) {
      onCodeGenerated(newContent, currentEnv.files);
    }
  };

  const handleTerminalCommand = (command: string) => {
    const newHistory = [...terminalHistory, `$ ${command}`];
    
    // Simulate realistic command responses
    if (command.includes('npm install')) {
      newHistory.push('📦 Installing dependencies...', '✅ Dependencies installed successfully');
    } else if (command.includes('npm run dev')) {
      newHistory.push('🚀 Starting development server...', '✅ Server running on http://localhost:3000');
    } else if (command.includes('npm run build')) {
      newHistory.push('🔨 Building for production...', '✅ Build completed successfully');
    } else if (command.includes('git')) {
      newHistory.push('🔄 Git command executed successfully');
    } else if (command.includes('vortex')) {
      newHistory.push('🧠 Vortex AI command executed', '✨ AI magic happening...');
    } else if (command === 'ls' || command === 'dir') {
      newHistory.push('src/', 'package.json', 'README.md', 'tsconfig.json');
    } else if (command === 'pwd') {
      newHistory.push('/workspace/vortex-sandbox');
    } else if (command === 'clear') {
      setTerminalHistory(['Welcome to Vortex Sandbox Terminal']);
      setTerminalInput('');
      return;
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

  const exportProject = () => {
    if (!currentEnv) return;

    const projectData = {
      name: currentEnv.name,
      framework: currentEnv.framework,
      language: currentEnv.language,
      files: currentEnv.files,
      dependencies: currentEnv.dependencies,
      timestamp: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentEnv.name.toLowerCase().replace(/\s+/g, '-')}-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Project Exported",
      description: "Your project has been exported successfully",
    });
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
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold">Live Sandbox</h2>
            </div>
            
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
                      {env.framework === 'fastapi' && <Zap className="w-4 h-4 text-yellow-500" />}
                      <span>{env.name}</span>
                      <Badge variant="outline" className="text-xs">{env.language}</Badge>
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
                {currentEnv.password}
              </Badge>
            )}
            
            <Badge variant={
              currentEnv?.status === 'running' ? 'default' : 
              currentEnv?.status === 'building' ? 'secondary' : 
              currentEnv?.status === 'error' ? 'destructive' : 'outline'
            }>
              {currentEnv?.status}
            </Badge>

            {currentEnv?.collaborators && currentEnv.collaborators.length > 0 && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                <Users className="w-3 h-3 mr-1" />
                {currentEnv.collaborators.length}
              </Badge>
            )}

            {(currentEnv?.status === 'idle' || currentEnv?.status === 'stopped') && (
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
              onClick={() => setShowTerminal(!showTerminal)}
            >
              <Terminal className="w-4 h-4 mr-1" />
              Terminal
            </Button>

            <Button 
              size="sm" 
              variant="outline"
              onClick={exportProject}
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* File Explorer & Environment Info */}
        <div className="w-80 border-r border-border bg-card/30 backdrop-blur flex flex-col">
          {/* File Explorer */}
          <div className="flex-1">
            <div className="p-3 border-b border-border">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-sm flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Project Files
                </h3>
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
                    className={`flex items-center gap-2 py-2 px-3 hover:bg-accent/50 cursor-pointer rounded text-sm transition-colors ${
                      selectedFile === file.id ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    onClick={() => setSelectedFile(file.id)}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="flex-1">{file.name}</span>
                    {file.isModified && (
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
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
            <h4 className="text-sm font-medium mb-3 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Environment
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Framework:</span>
                <Badge variant="outline" className="text-xs">{currentEnv?.framework}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Language:</span>
                <Badge variant="outline" className="text-xs">{currentEnv?.language}</Badge>
              </div>
              <div className="flex justify-between">
                <span>Dependencies:</span>
                <span className="font-medium">{currentEnv?.dependencies.length}</span>
              </div>
              
              <Separator className="my-2" />
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Cpu className="w-3 h-3" />
                    CPU:
                  </span>
                  <span className="font-medium">{currentEnv?.resourceLimits.cpu}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <MemoryStick className="w-3 h-3" />
                    Memory:
                  </span>
                  <span className="font-medium">{currentEnv?.resourceLimits.memory}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Timeout:
                  </span>
                  <span className="font-medium">{currentEnv?.resourceLimits.timeout}</span>
                </div>
              </div>

              {currentEnv?.url && (
                <div className="pt-2 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-1">Live URL:</div>
                  <div className="text-primary text-xs break-all bg-primary/10 p-2 rounded">
                    {currentEnv.url}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Code Editor & Preview */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="p-3 border-b border-border bg-card/30 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-xs">
                  {currentFile?.name || 'No file selected'}
                </Badge>
                {currentFile?.isModified && (
                  <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-500">
                    Modified
                  </Badge>
                )}
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
                  <Save className="w-3 h-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline">
                  <Share className="w-3 h-3 mr-1" />
                  Share
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Vortex IDE</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        AI-Powered
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <Textarea
                    value={currentFile?.content || ''}
                    onChange={(e) => currentFile && handleFileContentChange(currentFile.id, e.target.value)}
                    className="w-full h-full border-none resize-none font-mono text-sm p-4 bg-background"
                    placeholder="Select a file to start editing..."
                    style={{ fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace' }}
                  />
                  
                  {/* AI Code Assistant */}
                  <div className="absolute top-4 right-4">
                    <Card className="w-64 bg-card/95 backdrop-blur border-border shadow-lg">
                      <CardContent className="p-3">
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <Brain className="w-3 h-3" />
                            Vortex AI analyzing...
                          </div>
                          <div className="space-y-1">
                            <p className="text-primary font-medium">💡 AI Suggestion:</p>
                            <p className="text-muted-foreground">
                              Add error boundaries and loading states for better UX
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" className="flex-1 text-xs bg-gradient-primary">
                              Apply Fix
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              Explain
                            </Button>
                          </div>
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
                    {currentEnv?.status === 'running' && (
                      <Badge variant="default" className="text-xs bg-green-500/10 text-green-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                        Live
                      </Badge>
                    )}
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
                  className="bg-background border border-border rounded-lg overflow-hidden shadow-xl transition-all duration-300"
                  style={getPreviewDimensions()}
                >
                  {currentEnv?.status === 'running' && currentEnv.url ? (
                    <iframe
                      ref={iframeRef}
                      src={currentEnv.url}
                      className="w-full h-full"
                      title={`${currentEnv.name} Preview`}
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  ) : currentEnv?.status === 'building' ? (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground mb-2">Building {currentEnv.name}...</p>
                        {currentEnv.buildLogs.length > 0 && (
                          <div className="text-xs text-muted-foreground max-w-xs">
                            {currentEnv.buildLogs[currentEnv.buildLogs.length - 1]}
                          </div>
                        )}
                        <div className="mt-4 space-y-1">
                          {currentEnv.buildLogs.slice(-3).map((log, index) => (
                            <div key={index} className="text-xs text-muted-foreground">
                              {log}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8">
                      <div className="text-center">
                        <div className="p-4 bg-gradient-primary/10 rounded-full mb-4 mx-auto w-fit">
                          <Code className="w-12 h-12 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Environment Ready</p>
                        <p className="text-xs text-muted-foreground mb-4">
                          Click run to start your {currentEnv?.name}
                        </p>
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
                    <span className="text-xs">Vortex Terminal - {currentEnv?.name}</span>
                    <Badge variant="outline" className="text-xs border-green-500/30 text-green-400">
                      {currentEnv?.language}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setTerminalHistory(['Welcome to Vortex Sandbox Terminal'])}
                      className="h-6 text-green-400 hover:text-green-300 text-xs"
                    >
                      Clear
                    </Button>
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
              </div>
              
              <div className="flex-1 flex flex-col">
                <ScrollArea className="flex-1 p-3" ref={terminalRef}>
                  <div className="space-y-1">
                    {terminalHistory.map((line, index) => (
                      <div key={index} className={
                        line.startsWith('$') ? 'text-green-400' : 
                        line.includes('✅') || line.includes('🚀') ? 'text-blue-400' :
                        line.includes('❌') || line.includes('Error') ? 'text-red-400' :
                        'text-gray-300'
                      }>
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
                        if (e.key === 'ArrowUp') {
                          // Could implement command history here
                        }
                      }}
                      className="bg-transparent border-none text-green-400 placeholder-green-600/50 focus-visible:ring-0 font-mono"
                      placeholder="Enter command... (try: npm install, npm run dev, vortex help)"
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

export default LiveSandbox;