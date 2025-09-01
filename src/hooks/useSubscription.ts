import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionData {
  subscription_status: string | null;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        toast({
          title: "Error",
          description: "Failed to fetch subscription information",
          variant: "destructive"
        });
        return;
      }

      setSubscription(data);
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast({
        title: "Error",
        description: "Failed to fetch subscription information",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const getSubscriptionPlan = () => {
    if (!subscription || !subscription.subscription_status || subscription.subscription_status === 'not_started') {
      return 'Free';
    }

    if (subscription.price_id === 'price_1S2BGAFo9Nuy6V7lu5e4Z7C5') {
      return 'Pro';
    }

    if (subscription.price_id === 'price_1S2BFUFo9Nuy6V7lDaw8AVHx') {
      return 'Ultra';
    }

    return 'Free';
  };

  const isActive = () => {
    return subscription?.subscription_status === 'active';
  };

  const isPro = () => {
    return isActive() && subscription?.price_id === 'price_1S2BGAFo9Nuy6V7lu5e4Z7C5';
  };

  const isUltra = () => {
    return isActive() && subscription?.price_id === 'price_1S2BFUFo9Nuy6V7lDaw8AVHx';
  };

  return {
    subscription,
    loading,
    refetch: fetchSubscription,
    getSubscriptionPlan,
    isActive,
    isPro,
    isUltra
  };
};