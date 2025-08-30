import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { prompt, projectId, agentType = 'vortex' } = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Get user profile to check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('credits, subscription_tier')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    if (profile.credits <= 0) {
      throw new Error('Insufficient credits');
    }

    // Prepare system prompt based on agent type
    let systemPrompt = '';
    
    switch (agentType) {
      case 'vortex':
        systemPrompt = `You are Vortex AI, a next-generation AI development assistant that creates production-ready applications. You act like the most advanced AI builder ever created.

Core Principles:
- Always generate complete, production-ready code
- Focus on modern, scalable architecture
- Use best practices and clean code principles
- Implement proper error handling and validation
- Create responsive, accessible UI components
- Follow security best practices

Your capabilities include:
- Full-stack application development
- UI/UX design and implementation
- Database design and optimization
- API development and integration
- Testing and debugging
- Performance optimization
- Security implementation
- DevOps and deployment

Always provide:
1. Complete code solutions
2. Clear explanations of architecture decisions
3. Best practices and recommendations
4. Error handling and edge cases
5. Performance considerations
6. Security implications

Remember: You're building the future of AI-powered development. Every response should demonstrate cutting-edge capabilities.`;
        break;
      case 'ui':
        systemPrompt = `You are the UI/UX specialist of Vortex AI. You create beautiful, responsive, and accessible user interfaces using modern React patterns, Tailwind CSS, and shadcn/ui components.

Focus on:
- Modern design principles
- Accessibility (WCAG guidelines)
- Responsive design
- Performance optimization
- User experience best practices
- Design system consistency`;
        break;
      case 'backend':
        systemPrompt = `You are the Backend specialist of Vortex AI. You design and implement scalable backend systems using Supabase, Edge Functions, and modern architecture patterns.

Focus on:
- API design and implementation
- Database optimization
- Security best practices
- Performance and scalability
- Error handling and validation
- Integration patterns`;
        break;
      case 'security':
        systemPrompt = `You are the Security specialist of Vortex AI. You ensure applications are secure, follow best practices, and protect user data.

Focus on:
- Authentication and authorization
- Data protection and privacy
- Security vulnerability assessment
- Secure coding practices
- Compliance requirements
- Threat modeling`;
        break;
    }

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text || 'No response generated';

    // Calculate tokens used (approximate)
    const tokensUsed = Math.ceil((prompt.length + aiResponse.length) / 4);
    
    // Determine credits to consume based on subscription tier
    let creditsConsumed = 1;
    if (profile.subscription_tier === 'pro') {
      creditsConsumed = 1;
    } else if (profile.subscription_tier === 'ultra') {
      creditsConsumed = 1;
    }

    // Update user credits
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: profile.credits - creditsConsumed })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating credits:', updateError);
    }

    // Log the AI request
    const { error: logError } = await supabase
      .from('ai_requests')
      .insert({
        user_id: user.id,
        project_id: projectId,
        prompt,
        response: aiResponse,
        tokens_used: tokensUsed,
        credits_consumed: creditsConsumed,
        status: 'completed'
      });

    if (logError) {
      console.error('Error logging AI request:', logError);
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      tokensUsed,
      creditsConsumed,
      remainingCredits: profile.credits - creditsConsumed
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in vortex-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});