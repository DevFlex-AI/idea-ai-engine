import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SandboxManager from '@/components/Sandbox/SandboxManager';
import VortexIDE from '@/components/CodeEditor/VortexIDE';
import ProjectScaffolder from '@/components/ProjectBuilder/ProjectScaffolder';
import { 
  Brain, 
  Zap, 
  Code, 
  Palette, 
  Database, 
  Shield, 
  Send, 
  Mic, 
  MicOff,
  Sparkles,
  Cpu,
  Globe,
  Layers,
  Terminal,
  Rocket
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  agentType?: string;
  timestamp: Date;
}

const VortexBuilder = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('vortex');
  const [isListening, setIsListening] = useState(false);
  const [activeView, setActiveView] = useState<'chat' | 'sandbox' | 'ide' | 'scaffold'>('chat');
  const { user, profile, refetchProfile } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agents = [
    { 
      id: 'vortex', 
      name: 'Vortex AI', 
      icon: Brain, 
      color: 'bg-gradient-primary',
      description: 'Master AI that orchestrates all development tasks'
    },
    { 
      id: 'ui', 
      name: 'UI/UX Designer', 
      icon: Palette, 
      color: 'bg-gradient-to-r from-pink-500 to-purple-600',
      description: 'Creates beautiful, responsive interfaces'
    },
    { 
      id: 'backend', 
      name: 'Backend Engineer', 
      icon: Database, 
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600',
      description: 'Builds scalable server architectures'
    },
    { 
      id: 'security', 
      name: 'Security Expert', 
      icon: Shield, 
      color: 'bg-gradient-to-r from-red-500 to-orange-600',
      description: 'Ensures bulletproof security practices'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition failed",
          description: "Please try again or type your message",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive"
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to use Vortex AI",
        variant: "destructive"
      });
      return;
    }

    if (profile?.credits <= 0) {
      toast({
        title: "Insufficient credits",
        description: "You need credits to use Vortex AI. Upgrade your plan to continue.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('vortex-ai', {
        body: {
          prompt: input,
          agentType: selectedAgent,
          projectId: null // For now, we'll implement project management later
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.response,
        agentType: selectedAgent,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Refresh profile to update credits
      await refetchProfile();

      toast({
        title: "Response generated",
        description: `${data.creditsConsumed} credit used. ${data.remainingCredits} credits remaining.`,
      });

    } catch (error: any) {
      console.error('Error calling Vortex AI:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate response",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getAgentInfo = (agentId: string) => {
    return agents.find(agent => agent.id === agentId) || agents[0];
  };

  return (
    <div className="h-full flex flex-col bg-gradient-hero">
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Vortex AI Builder
              </h1>
              <p className="text-sm text-muted-foreground">
                Multi-agent AI development system
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-card/50 rounded-lg p-1">
              <Button 
                size="sm" 
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                onClick={() => setActiveView('chat')}
                className="text-xs"
              >
                <Brain className="w-3 h-3 mr-1" />
                Chat
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'scaffold' ? 'default' : 'ghost'}
                onClick={() => setActiveView('scaffold')}
                className="text-xs"
              >
                <Rocket className="w-3 h-3 mr-1" />
                Scaffold
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'ide' ? 'default' : 'ghost'}
                onClick={() => setActiveView('ide')}
                className="text-xs"
              >
                <Code className="w-3 h-3 mr-1" />
                IDE
              </Button>
              <Button 
                size="sm" 
                variant={activeView === 'sandbox' ? 'default' : 'ghost'}
                onClick={() => setActiveView('sandbox')}
                className="text-xs"
              >
                <Layers className="w-3 h-3 mr-1" />
                Sandbox
              </Button>
            </div>
            
          {profile && (
              <Badge variant="secondary" className="bg-gradient-primary/10 border-primary/20">
                <Zap className="w-3 h-3 mr-1" />
                {profile.credits} Credits
              </Badge>
              <Badge variant="outline" className="capitalize">
                {profile.subscription_tier}
              </Badge>
          )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'chat' && (
          <div className="h-full flex">
        {/* Agent Selection */}
        <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur">
          <div className="p-4">
            <h3 className="font-semibold mb-4">AI Agents</h3>
            <div className="space-y-2">
              {agents.map((agent) => {
                const Icon = agent.icon;
                const isSelected = selectedAgent === agent.id;
                
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      isSelected 
                        ? 'bg-primary/20 border border-primary/50' 
                        : 'bg-card/50 hover:bg-card/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${agent.color}`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {agent.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 max-w-4xl mx-auto">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-6">
                    <div className="inline-flex p-4 bg-gradient-primary/10 rounded-full">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Welcome to Vortex AI
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Your multi-agent AI development system. Choose an agent and start building the future.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {[
                      "Build a React dashboard with charts",
                      "Create a secure user authentication system",
                      "Design a modern landing page",
                      "Implement a real-time chat feature"
                    ].map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInput(suggestion)}
                        className="p-3 text-left bg-card/50 hover:bg-card/70 rounded-lg border border-border/50 transition-colors"
                      >
                        <p className="text-sm">{suggestion}</p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const agent = message.agentType ? getAgentInfo(message.agentType) : null;
                  const Icon = agent?.icon || Brain;
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-4 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className={`p-2 rounded-lg ${agent?.color || 'bg-gradient-primary'} shrink-0`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      
                      <Card className={`max-w-2xl ${
                        message.type === 'user' 
                          ? 'bg-primary/10 border-primary/20' 
                          : 'bg-card/50 border-border/50'
                      }`}>
                        <CardContent className="p-4">
                          {message.type === 'ai' && agent && (
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {agent.name}
                              </Badge>
                            </div>
                          )}
                          <pre className="whitespace-pre-wrap font-mono text-sm">
                            {message.content}
                          </pre>
                        </CardContent>
                      </Card>
                      
                      {message.type === 'user' && (
                        <div className="p-2 rounded-lg bg-primary/20 shrink-0">
                          <div className="w-5 h-5 rounded-full bg-primary/40" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-6 border-t border-border/50 bg-card/30 backdrop-blur">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Ask ${getAgentInfo(selectedAgent).name} anything...`}
                    className="min-h-[60px] pr-12 resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-2"
                    onClick={startVoiceRecognition}
                    disabled={isListening}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-red-500" />
                    ) : (
                      <Mic className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="bg-gradient-primary hover:shadow-glow"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {isListening && (
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening... Speak now
                </div>
              )}
            </div>
          </div>
        </div>
          </div>
        )}

        {activeView === 'scaffold' && <ProjectScaffolder />}
        {activeView === 'ide' && <VortexIDE />}
        {activeView === 'sandbox' && <SandboxManager />}
      </div>
    </div>
  );
};

export default VortexBuilder;