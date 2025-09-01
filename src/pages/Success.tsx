import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Home, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Success = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user, refetchProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionId && user) {
      // Refetch user profile to get updated subscription info
      refetchProfile().finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [sessionId, user, refetchProfile]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
        <Card className="p-8 text-center bg-card/50 backdrop-blur border-border max-w-md">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Processing your subscription...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-glow-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-glow-pulse"></div>
      </div>
      
      <Card className="p-12 text-center bg-card/50 backdrop-blur border-border max-w-lg relative z-10">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-bold mb-2">
            Payment Successful! 🎉
          </CardTitle>
          <p className="text-muted-foreground">
            Welcome to Vortex Pro! Your subscription is now active.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary">Subscription Activated</span>
            </div>
            <p className="text-sm text-muted-foreground">
              You now have access to premium AI models, priority support, and advanced features.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">What's Next?</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Access premium AI models</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Create unlimited private projects</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Get priority customer support</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" className="w-full border-border hover:bg-card/70">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link to="/" className="flex-1">
              <Button className="w-full bg-gradient-primary">
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Building
              </Button>
            </Link>
          </div>

          {sessionId && (
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Session ID: {sessionId}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;