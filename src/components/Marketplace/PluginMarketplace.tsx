import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Package, 
  Download, 
  Star, 
  Search, 
  Filter, 
  Zap, 
  Shield, 
  Database, 
  Palette, 
  Code, 
  Globe, 
  Smartphone,
  Brain,
  Settings,
  Plus,
  Heart,
  TrendingUp,
  Users,
  Verified
} from 'lucide-react';

interface Plugin {
  id: string;
  name: string;
  description: string;
  creator: string;
  category: string;
  version: string;
  rating: number;
  downloads: number;
  price: number;
  isVerified: boolean;
  tags: string[];
  supportedFrameworks: string[];
  icon: any;
  color: string;
}

const PluginMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [plugins, setPlugins] = useState<Plugin[]>([
    {
      id: 'ai-code-gen',
      name: 'AI Code Generator Pro',
      description: 'Advanced AI-powered code generation with context awareness and multi-language support',
      creator: 'Vortex Team',
      category: 'AI & ML',
      version: '2.1.0',
      rating: 4.9,
      downloads: 15420,
      price: 0,
      isVerified: true,
      tags: ['ai', 'codegen', 'typescript', 'react'],
      supportedFrameworks: ['react', 'vue', 'angular', 'svelte'],
      icon: Brain,
      color: 'bg-gradient-to-r from-purple-500 to-blue-600'
    },
    {
      id: 'ui-components',
      name: 'Vortex UI Kit',
      description: 'Beautiful, accessible UI components with dark mode and animations built-in',
      creator: 'Design Team',
      category: 'UI/UX',
      version: '1.8.2',
      rating: 4.8,
      downloads: 8930,
      price: 0,
      isVerified: true,
      tags: ['ui', 'components', 'design-system', 'accessibility'],
      supportedFrameworks: ['react', 'vue', 'svelte'],
      icon: Palette,
      color: 'bg-gradient-to-r from-pink-500 to-purple-600'
    },
    {
      id: 'auth-shield',
      name: 'Auth Shield',
      description: 'Complete authentication system with social logins, 2FA, and enterprise SSO',
      creator: 'Security Labs',
      category: 'Authentication',
      version: '3.0.1',
      rating: 4.7,
      downloads: 12100,
      price: 2900,
      isVerified: true,
      tags: ['auth', 'security', '2fa', 'sso'],
      supportedFrameworks: ['react', 'vue', 'angular', 'node'],
      icon: Shield,
      color: 'bg-gradient-to-r from-red-500 to-orange-600'
    },
    {
      id: 'db-wizard',
      name: 'Database Wizard',
      description: 'Visual database designer with AI-powered schema optimization and migration tools',
      creator: 'Data Team',
      category: 'Database',
      version: '1.5.0',
      rating: 4.6,
      downloads: 6750,
      price: 1900,
      isVerified: true,
      tags: ['database', 'schema', 'migration', 'optimization'],
      supportedFrameworks: ['supabase', 'postgresql', 'mysql', 'mongodb'],
      icon: Database,
      color: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    },
    {
      id: 'mobile-native',
      name: 'Native Bridge Pro',
      description: 'Seamless React Native integration with native iOS and Android APIs',
      creator: 'Mobile Team',
      category: 'Mobile',
      version: '2.3.0',
      rating: 4.5,
      downloads: 4320,
      price: 3900,
      isVerified: false,
      tags: ['react-native', 'ios', 'android', 'native-apis'],
      supportedFrameworks: ['react-native', 'expo'],
      icon: Smartphone,
      color: 'bg-gradient-to-r from-green-500 to-teal-600'
    },
    {
      id: 'deployment-engine',
      name: 'Deployment Engine',
      description: 'One-click deployment to AWS, Vercel, Netlify with CI/CD pipeline automation',
      creator: 'DevOps Team',
      category: 'DevOps',
      version: '1.2.1',
      rating: 4.4,
      downloads: 3890,
      price: 4900,
      isVerified: true,
      tags: ['deployment', 'cicd', 'aws', 'vercel'],
      supportedFrameworks: ['react', 'vue', 'angular', 'node'],
      icon: Globe,
      color: 'bg-gradient-to-r from-indigo-500 to-purple-600'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([]);

  const categories = [
    { id: 'all', name: 'All Categories', icon: Package },
    { id: 'AI & ML', name: 'AI & ML', icon: Brain },
    { id: 'UI/UX', name: 'UI/UX', icon: Palette },
    { id: 'Authentication', name: 'Authentication', icon: Shield },
    { id: 'Database', name: 'Database', icon: Database },
    { id: 'Mobile', name: 'Mobile', icon: Smartphone },
    { id: 'DevOps', name: 'DevOps', icon: Globe }
  ];

  const filteredPlugins = plugins.filter(plugin => {
    const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.downloads - a.downloads;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.version).getTime() - new Date(a.version).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleInstallPlugin = async (pluginId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to install plugins",
        variant: "destructive"
      });
      return;
    }

    const plugin = plugins.find(p => p.id === pluginId);
    if (!plugin) return;

    // Simulate installation
    setInstalledPlugins(prev => [...prev, pluginId]);
    
    toast({
      title: "Plugin Installed!",
      description: `${plugin.name} has been added to your workspace`,
    });

    // Update download count
    setPlugins(prev => prev.map(p => 
      p.id === pluginId 
        ? { ...p, downloads: p.downloads + 1 }
        : p
    ));
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return `$${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="h-full bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
                Plugin Marketplace
              </h1>
              <p className="text-muted-foreground">
                Extend Vortex with powerful plugins and integrations
              </p>
            </div>
            <Button className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Submit Plugin
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur border-border sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search plugins..."
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <div className="space-y-1">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-colors ${
                            selectedCategory === category.id 
                              ? 'bg-primary/20 text-primary' 
                              : 'hover:bg-accent/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plugin Grid */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPlugins.map(plugin => {
                const Icon = plugin.icon;
                const isInstalled = installedPlugins.includes(plugin.id);
                
                return (
                  <Card key={plugin.id} className="bg-card/50 backdrop-blur border-border hover:bg-card/70 transition-all duration-300 group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-3 rounded-lg ${plugin.color} mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1">
                          {plugin.isVerified && (
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              <Verified className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <CardTitle className="text-lg mb-1">{plugin.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {plugin.creator}
                        </p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {plugin.description}
                        </p>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              {plugin.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {plugin.downloads.toLocaleString()}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            v{plugin.version}
                          </Badge>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {plugin.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {plugin.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{plugin.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Supported Frameworks */}
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-muted-foreground">Supports:</span>
                          <div className="flex gap-1">
                            {plugin.supportedFrameworks.slice(0, 2).map(framework => (
                              <Badge key={framework} variant="outline" className="text-xs">
                                {framework}
                              </Badge>
                            ))}
                            {plugin.supportedFrameworks.length > 2 && (
                              <span className="text-xs text-muted-foreground">
                                +{plugin.supportedFrameworks.length - 2}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price and Install */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="text-lg font-bold">
                            {formatPrice(plugin.price)}
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleInstallPlugin(plugin.id)}
                            disabled={isInstalled}
                            className={isInstalled ? 'bg-green-500/20 text-green-500' : 'bg-gradient-primary'}
                          >
                            {isInstalled ? (
                              <>
                                <Download className="w-3 h-3 mr-1" />
                                Installed
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 mr-1" />
                                Install
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredPlugins.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No plugins found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Featured Plugins</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plugins.filter(p => p.isVerified).slice(0, 3).map(plugin => {
              const Icon = plugin.icon;
              return (
                <Card key={plugin.id} className="bg-gradient-primary border-0 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{plugin.name}</h3>
                        <p className="text-sm opacity-90">by {plugin.creator}</p>
                      </div>
                    </div>
                    <p className="text-sm opacity-90 mb-4">
                      {plugin.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-300" />
                        <span>{plugin.rating}</span>
                        <span className="opacity-70">•</span>
                        <span>{plugin.downloads.toLocaleString()} downloads</span>
                      </div>
                      <Button variant="secondary" size="sm">
                        Install
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginMarketplace;