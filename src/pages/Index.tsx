import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/Navbar";
import { PricingTiers } from "@/components/PricingTiers";
import { Sparkles, Zap, Globe, Brain, Rocket, Star } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative py-32 px-6 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-glow-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-glow-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <Badge className="mb-6 bg-card/50 backdrop-blur border-border">
              <Sparkles className="w-4 h-4 mr-2" />
              Now with Enterprise AI
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-primary bg-clip-text text-transparent animate-fade-in">
              AI-Powered<br />Development Platform
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in">
              Build, deploy, and scale AI applications with our comprehensive platform. 
              From prototype to enterprise - all with industry-leading AI integrations.
            </p>
            
            <div className="flex gap-4 justify-center animate-fade-in">
              <Button size="lg" className="bg-gradient-primary hover:shadow-glow text-lg px-8 py-6">
                <Rocket className="w-5 h-5 mr-2" />
                Start Building
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-border hover:bg-card/50">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI Integrations</h2>
            <p className="text-xl text-muted-foreground">Everything you need to build the next generation of AI applications</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Advanced AI Models",
                description: "Access to GPT-4, Claude, Gemini, and custom models with seamless switching"
              },
              {
                icon: Globe,
                title: "Global Infrastructure",
                description: "Deploy worldwide with edge computing and automatic scaling"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized for speed with intelligent caching and pre-processing"
              }
            ].map((feature, index) => (
              <Card key={index} className="p-8 bg-card/50 backdrop-blur border-border hover:bg-card/70 transition-all duration-300">
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground">Flexible pricing for every stage of your journey</p>
          </div>
          
          <PricingTiers />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center">
          <Card className="p-12 bg-gradient-primary border-0 text-white">
            <Star className="w-16 h-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Development?</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of developers building the future with our AI platform
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Free
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;