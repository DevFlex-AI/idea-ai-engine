import React, { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { 
  Cpu, 
  Zap, 
  Code, 
  Smartphone, 
  Globe, 
  Database,
  Send,
  Sparkles,
  Brain,
  Settings,
  Download
} from 'lucide-react';

interface AIResponse {
  content: string;
  creditsUsed: number;
  remainingCredits: number;
}

const VortexBuilder = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [selectedAgent, setSelectedAgent] = useState('vortex');
  const [credits, setCredits] = useState(100);
  const { toast } = useToast();
  const { user } = useAuth();
  const { getSubscriptionPlan, isActive } = useSubscription();
  const chatRef = useRef<HTMLDivElement>(null);

  const agents = [
    { id: 'vortex', name: 'Vortex AI', icon: Brain, color: 'from-purple-500 to-pink-500' },
    { id: 'ui', name: 'UI/UX Designer', icon: Sparkles, color: 'from-blue-500 to-cyan-500' },
    { id: 'backend', name: 'Backend Engineer', icon: Database, color: 'from-green-500 to-emerald-500' },
    { id: 'mobile', name: 'Mobile Developer', icon: Smartphone, color: 'from-orange-500 to-red-500' },
    { id: 'fullstack', name: 'Full-Stack Dev', icon: Globe, color: 'from-indigo-500 to-purple-500' },
  ];

  const generateWithAI = async () => {
    if (!prompt.trim() || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('vortex-ai', {
        body: {
          prompt,
          agentType: selectedAgent,
          projectId: 'default'
        }
      });

      if (error) throw error;

      setResponse({
        content: data.response,
        creditsUsed: data.creditsUsed,
        remainingCredits: data.remainingCredits
      });
      
      setCredits(data.remainingCredits);
      setPrompt('');
      
      toast({
        title: "AI Generated Successfully",
        description: `Used ${data.creditsUsed} credits. ${data.remainingCredits} remaining.`
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate with AI",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [response]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Vortex AI Builder
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transform your ideas into production-ready applications with AI-powered multi-agent development
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              {credits} Credits
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              {getSubscriptionPlan()} Plan
            </Badge>
            <Badge variant="outline" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Powered by Gemini AI
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* AI Agents Panel */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Agents
            </h3>
            <div className="space-y-3">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent === agent.id ? "default" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    selectedAgent === agent.id 
                      ? `bg-gradient-to-r ${agent.color} text-white` 
                      : ""
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <agent.icon className="h-4 w-4" />
                  {agent.name}
                </Button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Current Agent</h4>
              <p className="text-sm text-muted-foreground">
                {agents.find(a => a.id === selectedAgent)?.name} - Specialized AI for your specific needs
              </p>
            </div>
          </Card>

          {/* Main Chat Interface */}
          <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="p-6">
              <div 
                ref={chatRef}
                className="h-96 overflow-y-auto mb-4 space-y-4 bg-muted/20 rounded-lg p-4"
              >
                {response ? (
                  <div className="space-y-4">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-primary" />
                        <span className="font-medium text-primary">
                          {agents.find(a => a.id === selectedAgent)?.name}
                        </span>
                      </div>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-sm">{response.content}</pre>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Start a conversation with Vortex AI</p>
                    <p className="text-sm">Describe what you want to build</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your app idea, feature request, or ask for help..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4" />
                    ~1-5 credits per request
                  </div>
                  
                  <Button
                    onClick={generateWithAI}
                    disabled={!prompt.trim() || isGenerating || credits < 1}
                    className="bg-gradient-to-r from-primary to-secondary"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Showcase */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-8">AI-Powered Development Tools</h2>
          <Tabs defaultValue="web" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="web">Web Apps</TabsTrigger>
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="backend">Backend</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="deploy">Deploy</TabsTrigger>
            </TabsList>
            
            <TabsContent value="web" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Web Application Builder</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Frameworks Supported</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Vue', 'Angular', 'Svelte', 'Solid'].map(fw => (
                        <Badge key={fw} variant="secondary">{fw}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Responsive Design</li>
                      <li>• Dark/Light Mode</li>
                      <li>• Component Library</li>
                      <li>• State Management</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="mobile" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mobile Development</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {['React Native', 'Flutter', 'Ionic', 'Capacitor'].map(platform => (
                        <Badge key={platform} variant="secondary">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Native Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Camera Integration</li>
                      <li>• Push Notifications</li>
                      <li>• Offline Storage</li>
                      <li>• Biometric Auth</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="backend" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Backend Services</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Python', 'Go', 'Rust', 'Java'].map(tech => (
                        <Badge key={tech} variant="secondary">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Services</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• REST & GraphQL APIs</li>
                      <li>• Authentication</li>
                      <li>• File Storage</li>
                      <li>• Real-time Features</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Database Management</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Database Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {['PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase'].map(db => (
                        <Badge key={db} variant="secondary">{db}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Schema Design</li>
                      <li>• Migrations</li>
                      <li>• Query Optimization</li>
                      <li>• Backup Strategies</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="deploy" className="mt-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Deployment & Hosting</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Platforms</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Vercel', 'Netlify', 'AWS', 'Google Cloud', 'Azure'].map(platform => (
                        <Badge key={platform} variant="secondary">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Features</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Auto-scaling</li>
                      <li>• CI/CD Pipelines</li>
                      <li>• SSL Certificates</li>
                      <li>• CDN Integration</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VortexBuilder;