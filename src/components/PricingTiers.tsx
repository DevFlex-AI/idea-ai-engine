import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Crown, Rocket } from "lucide-react";
import { products } from "@/stripe-config";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
    popular: false,
    priceId: null
  },
  {
    name: "Pro",
    credits: "1,000",
    price: "$100",
    period: "month",
    description: "Your are very pro for gettign vortex pro",
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
    popular: true,
    priceId: "price_1S2BGAFo9Nuy6V7lu5e4Z7C5"
  },
  {
    name: "Ultra",
    credits: "1,000,000",
    price: "$500",
    period: "month",
    description: "You are so sigma for getting vortex ultra",
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
    popular: false,
    priceId: "price_1S2BFUFo9Nuy6V7lDaw8AVHx"
  }
];

export const PricingTiers = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, tierName: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to purchase a subscription.",
        variant: "destructive"
      });
      return;
    }

    setLoading(priceId);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          price_id: priceId,
          mode: 'subscription',
          success_url: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/?canceled=true`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout process",
        variant: "destructive"
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {tiers.map((tier, index) => {
        const Icon = tier.icon;
        const isLoading = loading === tier.priceId;
        
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
              onClick={() => tier.priceId && handleCheckout(tier.priceId, tier.name)}
              disabled={isLoading || !tier.priceId}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : tier.price === "$0" ? (
                "Get Started Free"
              ) : (
                "Choose Plan"
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};