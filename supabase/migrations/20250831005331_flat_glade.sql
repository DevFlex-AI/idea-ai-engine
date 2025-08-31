/*
  # Enhanced production-ready database schema for Vortex AI Platform

  1. New Tables
    - Enhanced `profiles`, `projects`, `ai_requests` with comprehensive features
    - `teams` - Team collaboration and workspace management
    - `team_members` - Team membership with roles and permissions
    - `templates` - AI-generated project templates and marketplace
    - `notifications` - Real-time notification system
    - `subscriptions` - Stripe billing and subscription management
    - `usage_tracking` - Resource usage monitoring per user
    - `analytics_events` - User behavior and platform analytics
    - `system_logs` - Admin logging and monitoring
    - `sandbox_environments` - Live sandbox management
    - `code_sessions` - Password-protected IDE sessions
    - `plugin_marketplace` - Plugin ecosystem

  2. Security
    - Enable RLS on all new tables
    - Add comprehensive policies for data access
    - Enhanced role-based access control
    - Secure sandbox isolation

  3. Features
    - Multi-language sandbox support
    - Password-protected IDE sessions
    - Real-time collaboration
    - Template marketplace
    - Plugin ecosystem
    - Advanced analytics
*/

-- Enhanced profiles table with comprehensive user data
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
  total_ai_requests INTEGER DEFAULT 0,
  coding_style_preferences JSONB DEFAULT '{}',
  preferred_frameworks TEXT[] DEFAULT ARRAY['react'],
  ai_memory_context JSONB DEFAULT '{}';

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
  view_count INTEGER DEFAULT 0,
  sandbox_config JSONB DEFAULT '{}',
  collaboration_settings JSONB DEFAULT '{}';

-- Enhanced AI requests tracking
ALTER TABLE public.ai_requests ADD COLUMN IF NOT EXISTS
  agent_type TEXT DEFAULT 'vortex' CHECK (agent_type IN ('vortex', 'ui', 'backend', 'security', 'testing', 'deployment')),
  model_used TEXT DEFAULT 'gemini-pro',
  processing_time_ms INTEGER,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  context_memory JSONB DEFAULT '{}',
  generated_files JSONB DEFAULT '{}';

-- Sandbox environments table
CREATE TABLE IF NOT EXISTS public.sandbox_environments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID,
  name TEXT NOT NULL,
  language TEXT NOT NULL,
  framework TEXT NOT NULL,
  status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'building', 'running', 'error', 'stopped')),
  url TEXT,
  password TEXT,
  is_secure BOOLEAN DEFAULT false,
  files JSONB DEFAULT '{}',
  dependencies JSONB DEFAULT '{}',
  build_logs TEXT[],
  environment_config JSONB DEFAULT '{}',
  resource_limits JSONB DEFAULT '{"cpu": "1", "memory": "512MB", "timeout": "30s"}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Code sessions for password-protected IDE
CREATE TABLE IF NOT EXISTS public.code_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  project_id UUID,
  session_token TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  permissions JSONB DEFAULT '{"read": true, "write": true, "execute": false}',
  collaborators UUID[],
  active_files JSONB DEFAULT '{}',
  cursor_positions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

-- Teams and collaboration
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
  ai_memory_shared JSONB DEFAULT '{}',
  coding_standards JSONB DEFAULT '{}',
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
  ai_generation_prompt TEXT,
  supported_languages TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Plugin marketplace
CREATE TABLE IF NOT EXISTS public.plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL,
  category TEXT NOT NULL,
  version TEXT DEFAULT '1.0.0',
  plugin_code TEXT NOT NULL,
  configuration_schema JSONB DEFAULT '{}',
  supported_frameworks TEXT[],
  install_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_public BOOLEAN DEFAULT true,
  price_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (creator_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Notifications system
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('system', 'project', 'collaboration', 'billing', 'security', 'feature', 'bug', 'sandbox', 'ai')),
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
  resource_type TEXT NOT NULL CHECK (resource_type IN ('ai_requests', 'projects', 'deployments', 'storage', 'bandwidth', 'sandbox_time', 'builds')),
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
  sandbox_reproduction_url TEXT,
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
  prototype_sandbox_url TEXT,
  ai_feasibility_score INTEGER,
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

-- Enable RLS on all tables
ALTER TABLE public.sandbox_environments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.code_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Sandbox environment policies
CREATE POLICY "Users can manage their sandbox environments" ON public.sandbox_environments
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Team members can view shared sandboxes" ON public.sandbox_environments
FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (
    SELECT 1 FROM public.projects p 
    JOIN public.team_members tm ON tm.team_id = p.user_id::uuid
    WHERE p.id = project_id AND tm.user_id = auth.uid()
  )
);

-- Code session policies
CREATE POLICY "Users can manage their code sessions" ON public.code_sessions
FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Collaborators can access shared sessions" ON public.code_sessions
FOR SELECT USING (
  user_id = auth.uid() OR 
  auth.uid() = ANY(collaborators)
);

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

-- Plugin policies
CREATE POLICY "Public plugins visible to all" ON public.plugins
FOR SELECT USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can manage their plugins" ON public.plugins
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

-- Enhanced functions
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

-- Function to create secure sandbox session
CREATE OR REPLACE FUNCTION public.create_sandbox_session(
  p_user_id UUID,
  p_project_id UUID,
  p_environment_id UUID
) RETURNS TEXT AS $$
DECLARE
  session_password TEXT;
  session_token TEXT;
BEGIN
  -- Generate secure password
  session_password := encode(gen_random_bytes(12), 'base64');
  session_token := encode(gen_random_bytes(32), 'hex');
  
  -- Create session
  INSERT INTO public.code_sessions (
    user_id, 
    project_id, 
    session_token, 
    password,
    expires_at
  ) VALUES (
    p_user_id, 
    p_project_id, 
    session_token, 
    session_password,
    now() + interval '24 hours'
  );
  
  -- Update sandbox with password
  UPDATE public.sandbox_environments 
  SET password = session_password, is_secure = true
  WHERE id = p_environment_id AND user_id = p_user_id;
  
  RETURN session_password;
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
CREATE INDEX IF NOT EXISTS idx_sandbox_environments_user_status ON public.sandbox_environments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_code_sessions_token ON public.code_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_code_sessions_active ON public.code_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_ai_requests_user_created ON public.ai_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_user_updated ON public.projects(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_date ON public.usage_tracking(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_level_created ON public.system_logs(level, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_public_featured ON public.templates(is_public, is_featured) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_plugins_public_category ON public.plugins(is_public, category) WHERE is_public = true;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_sandbox_environments_updated_at
  BEFORE UPDATE ON public.sandbox_environments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_plugins_updated_at
  BEFORE UPDATE ON public.plugins
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();