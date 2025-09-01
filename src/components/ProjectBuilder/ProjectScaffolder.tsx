import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Rocket, 
  Globe, 
  Smartphone, 
  Monitor, 
  Database, 
  Shield, 
  Zap, 
  Palette, 
  Code, 
  GitBranch,
  Package,
  Settings,
  CheckCircle,
  Eye
} from 'lucide-react';

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: string;
  features: string[];
  techStack: string[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const templates: ProjectTemplate[] = [
  {
    id: 'saas-dashboard',
    name: 'SaaS Dashboard',
    description: 'Complete SaaS application with authentication, billing, and analytics',
    icon: Monitor,
    category: 'Web App',
    features: ['Authentication', 'Stripe Billing', 'Analytics', 'Admin Panel', 'API'],
    techStack: ['React', 'TypeScript', 'Supabase', 'Stripe', 'Tailwind'],
    estimatedTime: '2-3 hours',
    difficulty: 'intermediate'
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Cross-platform mobile app with native features',
    icon: Smartphone,
    category: 'Mobile',
    features: ['Navigation', 'Push Notifications', 'Camera', 'Location', 'Offline'],
    techStack: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
    estimatedTime: '3-4 hours',
    difficulty: 'advanced'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Full-featured online store with payments and inventory',
    icon: Package,
    category: 'E-commerce',
    features: ['Product Catalog', 'Shopping Cart', 'Payments', 'Orders', 'Admin'],
    techStack: ['Next.js', 'Stripe', 'Supabase', 'Tailwind'],
    estimatedTime: '4-5 hours',
    difficulty: 'advanced'
  },
  {
    id: 'landing-page',
    name: 'Landing Page',
    description: 'High-converting landing page with modern design',
    icon: Globe,
    category: 'Marketing',
    features: ['Hero Section', 'Features', 'Testimonials', 'CTA', 'Analytics'],
    techStack: ['React', 'Tailwind', 'Framer Motion'],
    estimatedTime: '1-2 hours',
    difficulty: 'beginner'
  }
];

const ProjectScaffolder = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customizations, setCustomizations] = useState({
    theme: 'dark',
    primaryColor: 'purple',
    authentication: true,
    database: true,
    payments: false,
    analytics: false
  });

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleCreateProject = async () => {
    // This would integrate with the AI system to generate the project
    console.log('Creating project:', {
      template: selectedTemplate,
      name: projectName,
      description: projectDescription,
      features: selectedFeatures,
      customizations
    });
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="h-full bg-gradient-hero p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Project Scaffolder
          </h1>
          <p className="text-muted-foreground">
            Generate production-ready applications with AI-powered architecture
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-primary" />
                  Choose Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {templates.map(template => {
                    const Icon = template.icon;
                    const isSelected = selectedTemplate === template.id;
                    
                    return (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all ${
                          isSelected 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:bg-card/70'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{template.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                {template.description}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  {template.category}
                                </Badge>
                                <Badge 
                                  variant={template.difficulty === 'beginner' ? 'default' : 
                                          template.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                                  className="text-xs"
                                >
                                  {template.difficulty}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ⏱️ {template.estimatedTime}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            {selectedTemplate && (
              <Card className="bg-card/50 backdrop-blur border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary" />
                    Project Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="My Awesome App"
                      />
                    </div>
                    <div>
                      <Label htmlFor="project-description">Description</Label>
                      <Input
                        id="project-description"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Brief description of your app"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Customizations</Label>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="auth"
                            checked={customizations.authentication}
                            onCheckedChange={(checked) => 
                              setCustomizations(prev => ({ ...prev, authentication: !!checked }))
                            }
                          />
                          <Label htmlFor="auth" className="text-sm">Authentication</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="db"
                            checked={customizations.database}
                            onCheckedChange={(checked) => 
                              setCustomizations(prev => ({ ...prev, database: !!checked }))
                            }
                          />
                          <Label htmlFor="db" className="text-sm">Database</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="payments"
                            checked={customizations.payments}
                            onCheckedChange={(checked) => 
                              setCustomizations(prev => ({ ...prev, payments: !!checked }))
                            }
                          />
                          <Label htmlFor="payments" className="text-sm">Payments (Stripe)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="analytics"
                            checked={customizations.analytics}
                            onCheckedChange={(checked) => 
                              setCustomizations(prev => ({ ...prev, analytics: !!checked }))
                            }
                          />
                          <Label htmlFor="analytics" className="text-sm">Analytics</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Theme</Label>
                      <Select 
                        value={customizations.theme} 
                        onValueChange={(value) => 
                          setCustomizations(prev => ({ ...prev, theme: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Primary Color</Label>
                      <Select 
                        value={customizations.primaryColor} 
                        onValueChange={(value) => 
                          setCustomizations(prev => ({ ...prev, primaryColor: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="red">Red</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Project Preview */}
          <div className="space-y-6">
            {selectedTemplateData && (
              <Card className="bg-card/50 backdrop-blur border-border">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="w-5 h-5 mr-2 text-primary" />
                    Template Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Features Included</h4>
                      <div className="space-y-1">
                        {selectedTemplateData.features.map(feature => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplateData.techStack.map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <div className="text-sm">
                        <div className="font-medium text-primary mb-1">
                          Estimated Build Time
                        </div>
                        <div className="text-muted-foreground">
                          {selectedTemplateData.estimatedTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Project Button */}
            <Card className="bg-gradient-primary border-0 text-white">
              <CardContent className="p-6 text-center">
                <Rocket className="w-8 h-8 mx-auto mb-3 opacity-90" />
                <h3 className="font-semibold mb-2">Ready to Build?</h3>
                <p className="text-sm opacity-90 mb-4">
                  AI will generate your complete project in minutes
                </p>
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="w-full"
                  onClick={handleCreateProject}
                  disabled={!selectedTemplate || !projectName}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Project with AI
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectScaffolder;