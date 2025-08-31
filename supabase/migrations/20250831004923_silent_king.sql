/*
  # Enhanced production-ready database schema for Vortex AI Platform

  1. New Tables
    - `teams` - Team collaboration and workspace management
    - `team_members` - Team membership with roles and permissions
    - `templates` - AI-generated project templates and marketplace
    - `notifications` - Real-time notification system
    - `subscriptions` - Stripe billing and subscription management
    - `usage_tracking` - Resource usage monitoring per user
    - `analytics_events` - User behavior and platform analytics
    - `system_logs` - Admin logging and monitoring
    - Enhanced `profiles`, `projects`, `ai_requests`, `bug_reports`, `feature_requests`

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for data access
    - Enhanced role-based access control

  3. Features
    - Team collaboration system
    - Template marketplace
    - Real-time notifications
    - Usage analytics and tracking
    - Enhanced admin capabilities
    - Subscription and billing integration
*/

-- Enhanced profiles table with all user data
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS 
  bio TEXT,
  company TEXT,
  website TEXT,
  location TEXT,
  github_username TEXT,
  twitter_username TEXT,
  discord_username TEXT,
  theme_preference TEXT DEFAULT 'dark',
  notification_preferences JSONB DEFAULT '{"email": true, "browser": true, "discord": false}',
  onboarding_completed BOOLEAN DEFAULT false,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  total_projects INTEGER DEFAULT 0,
  total_ai_requests INTEGER DEFAULT 0;

-- Enhanced projects table with comprehensive features
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS
  repository_url TEXT,
  deployment_url TEXT,
  preview_url TEXT,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private', 'unlisted')),
  tags TEXT[],
  tech_stack JSONB DEFAULT '{}',
  ai_model_preference TEXT DEFAULT 'gemini-pro',
  build_status TEXT DEFAULT 'idle' CHECK (build_status IN ('idle', 'building', 'deployed', 'failed')),
  last_build_at TIMESTAMPTZ,
  star_count INTEGER DEFAULT 0,
  fork_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0;

-- Enhanced AI requests tracking
ALTER TABLE public.ai_requests ADD COLUMN IF NOT EXISTS
  agent_type TEXT DEFAULT 'vortex' CHECK (agent_type IN ('vortex', 'ui', 'backend', 'security', 'testing', 'deployment')),
  model_used TEXT DEFAULT 'gemini-pro',
  processing_time_ms INTEGER,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT;

-- Teams and collaboration tables
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'ultra', 'enterprise')),
  max_members INTEGER DEFAULT 5,
  FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID,
  joined_at TIMESTAMPTZ DEFAULT now(),
  permissions JSONB DEFAULT '{"read": true, "write": false, "admin": false}',
  UNIQUE(team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES public.teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Templates and marketplace
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  preview_image_url TEXT,
  creator_id UUID NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[],
  framework TEXT DEFAULT 'react',
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time_hours INTEGER DEFAULT 1,
  is_featured BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  template_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notifications system
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'project', 'collaboration', 'billing', 'security', 'feature', 'bug')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMPTZ,
  action_url TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Billing and subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'ultra', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'trialing')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('ai_requests', 'projects', 'deployments', 'storage', 'bandwidth')),
  amount INTEGER NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, resource_type, date),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enhanced admin tables for bug reports and feature requests
ALTER TABLE public.bug_reports ADD COLUMN IF NOT EXISTS
  browser TEXT,
  os TEXT,
  screen_resolution TEXT,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  attachments TEXT[],
  assigned_to UUID,
  priority_score INTEGER DEFAULT 0,
  tags TEXT[],
  duplicate_of UUID,
  FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL,
  FOREIGN KEY (duplicate_of) REFERENCES public.bug_reports(id) ON DELETE SET NULL;

ALTER TABLE public.feature_requests ADD COLUMN IF NOT EXISTS
  business_case TEXT,
  target_users TEXT,
  acceptance_criteria TEXT,
  estimated_effort TEXT,
  assigned_to UUID,
  milestone TEXT,
  tags TEXT[],
  attachments TEXT[],
  dependencies UUID[],
  FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;

-- Analytics and metrics
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  event_name TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url TEXT,
  user_agent TEXT,
  ip_address INET,
  country TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- System logs for admin
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error', 'fatal')),
  message TEXT NOT NULL,
  service TEXT,
  user_id UUID,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enhanced RLS policies for all tables
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Users can view teams they belong to" ON public.teams
FOR SELECT USING (
  owner_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.team_members WHERE team_id = id AND user_id = auth.uid())
);

CREATE POLICY "Team owners can manage their teams" ON public.teams
FOR ALL USING (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "Team members can view team membership" ON public.team_members
FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.teams WHERE id = team_id AND owner_id = auth.uid())
);

-- Templates policies
CREATE POLICY "Public templates visible to all" ON public.templates
FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can manage their templates" ON public.templates
FOR ALL USING (creator_id = auth.uid());

-- Notifications policies
CREATE POLICY "Users can view their notifications" ON public.notifications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON public.notifications
FOR UPDATE USING (user_id = auth.uid());

-- Subscriptions policies
CREATE POLICY "Users can view their subscriptions" ON public.subscriptions
FOR SELECT USING (user_id = auth.uid());

-- Usage tracking policies
CREATE POLICY "Users can view their usage" ON public.usage_tracking
FOR SELECT USING (user_id = auth.uid());

-- Admin-only policies for system logs
CREATE POLICY "Admins can view system logs" ON public.system_logs
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Analytics policies (admin only)
CREATE POLICY "Admins can view analytics" ON public.analytics_events
FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- Create functions for enhanced functionality
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_resource_type TEXT,
  p_amount INTEGER DEFAULT 1
) RETURNS VOID AS $$
BEGIN
  INSERT INTO public.usage_tracking (user_id, resource_type, amount, date)
  VALUES (p_user_id, p_resource_type, p_amount, CURRENT_DATE)
  ON CONFLICT (user_id, resource_type, date)
  DO UPDATE SET amount = usage_tracking.amount + p_amount;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user limits
CREATE OR REPLACE FUNCTION public.check_user_limit(
  p_user_id UUID,
  p_resource_type TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
BEGIN
  SELECT COALESCE(amount, 0) INTO current_usage
  FROM public.usage_tracking
  WHERE user_id = p_user_id 
    AND resource_type = p_resource_type 
    AND date = CURRENT_DATE;
    
  RETURN current_usage < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user subscription tier
CREATE OR REPLACE FUNCTION public.get_user_tier(p_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_tier TEXT;
BEGIN
  SELECT COALESCE(s.plan, p.subscription_tier::TEXT, 'free')
  INTO user_tier
  FROM public.profiles p
  LEFT JOIN public.subscriptions s ON s.user_id = p.user_id AND s.status = 'active'
  WHERE p.user_id = p_user_id;
  
  RETURN COALESCE(user_tier, 'free');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_created ON public.ai_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON public.projects(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON public.usage_tracking(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_created ON public.system_logs(level, created_at DESC);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_teams_updated_at ON public.teams;
CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();