import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";

const tiers = [
  {
    name: "Free",
    credits: "100",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with AI development",
    features: [
      "100 AI credits monthly",
      "Basic AI models access",
      "Community support",
      "Standard API rate limits",
      "Public project hosting"
    ],
    icon: Zap,
    color: "tier-free",
    popular: false
  },
  {
    name: "Pro",
    credits: "1,000",
    price: "$29",
    period: "month",
    description: "For professional developers and small teams",
    features: [
      "1,000 AI credits monthly",
      "Premium AI models",
      "Priority support",
      "Higher API rate limits",
      "Private repositories",
      "Advanced analytics",
      "Custom integrations"
    ],
    icon: Crown,
    color: "tier-pro",
    popular: true
  },
  {
    name: "Ultra",
    credits: "1,000,000",
    price: "$299",
    period: "month",
    description: "Enterprise-grade solution for scaling businesses",
    features: [
      "1M AI credits monthly",
      "All AI models + custom",
      "24/7 dedicated support",
      "Unlimited API calls",
      "Enterprise security",
      "Advanced admin controls",
      "Custom model training",
      "SLA guarantees",
      "On-premise deployment"
    ],
    icon: Rocket,
    color: "tier-ultra",
    popular: false
  }
];

export const PricingTiers = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {tiers.map((tier, index) => {
        const Icon = tier.icon;
        return (
          <Card 
            key={index} 
            className={`relative p-8 bg-card/50 backdrop-blur border-border hover:bg-card/70 transition-all duration-300 ${
              tier.popular ? 'ring-2 ring-primary animate-glow-pulse' : ''
            }`}
          >
            {tier.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary border-0">
                Most Popular
              </Badge>
            )}
            
            <div className="text-center mb-6">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-${tier.color}/20 flex items-center justify-center`}>
                <Icon className={`w-6 h-6 text-${tier.color}`} />
              </div>
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline justify-center mb-2">
                <span className="text-4xl font-bold">{tier.price}</span>
                <span className="text-muted-foreground ml-1">/{tier.period}</span>
              </div>
              <div className={`text-sm font-medium text-${tier.color} mb-3`}>
                {tier.credits} credits
              </div>
              <p className="text-sm text-muted-foreground">{tier.description}</p>
            </div>

            <div className="space-y-3 mb-8">
              {tier.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center">
                  <Check className="w-4 h-4 text-accent mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className={`w-full ${
                tier.popular 
                  ? 'bg-gradient-primary hover:shadow-glow' 
                  : 'bg-card hover:bg-muted border border-border'
              }`}
              size="lg"
            >
              {tier.price === "$0" ? "Get Started Free" : "Choose Plan"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};