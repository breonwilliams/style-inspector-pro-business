import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// Define feature mappings based on subscription plans
const PLAN_FEATURES = {
  free: [],
  pro: [
    'ai_analysis',
    'advanced_color_analysis',
    'font_analysis',
    'usage_history',
    'premium_exports'
  ],
  team: [
    'ai_analysis',
    'advanced_color_analysis',
    'font_analysis',
    'usage_history',
    'premium_exports',
    'batch_processing',
    'api_access',
    'team_collaboration'
  ]
};

const PLAN_QUOTAS = {
  free: {
    ai_analyses: 0,
    exports: 0,
    batch_operations: 0
  },
  pro: {
    ai_analyses: -1, // unlimited
    exports: -1,     // unlimited
    batch_operations: 10
  },
  team: {
    ai_analyses: -1, // unlimited
    exports: -1,     // unlimited
    batch_operations: -1 // unlimited
  }
};

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        valid: false,
        error: 'No valid authorization token'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({
        valid: false,
        error: 'Invalid token'
      });
    }

    // Get user subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (subscriptionError) {
      console.error('Error fetching subscription:', subscriptionError);
    }

    // Determine current plan
    const currentPlan = subscription?.plan_name || 'free';
    const subscriptionStatus = subscription?.status || 'active';

    // Check if subscription is valid (active and not expired)
    let isValid = true;
    let effectivePlan = currentPlan;

    if (subscription && subscription.current_period_end) {
      const expirationDate = new Date(subscription.current_period_end);
      const now = new Date();
      
      if (now > expirationDate || subscriptionStatus !== 'active') {
        isValid = false;
        effectivePlan = 'free'; // Downgrade to free if expired or inactive
      }
    }

    // If subscription is not active, treat as free plan
    if (subscriptionStatus !== 'active') {
      effectivePlan = 'free';
      isValid = currentPlan === 'free'; // Only valid if it's supposed to be free
    }

    // Get features and quotas for the effective plan
    const features = PLAN_FEATURES[effectivePlan as keyof typeof PLAN_FEATURES] || [];
    const quotas = PLAN_QUOTAS[effectivePlan as keyof typeof PLAN_QUOTAS] || PLAN_QUOTAS.free;

    return res.status(200).json({
      valid: isValid,
      plan: effectivePlan,
      original_plan: currentPlan,
      status: subscriptionStatus,
      features,
      usage_quotas: quotas,
      expires_at: subscription?.current_period_end || null,
      stripe_customer_id: subscription?.stripe_customer_id || null,
      user_id: user.id,
      checked_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Extension subscription validation error:', error);
    return res.status(500).json({
      valid: false,
      error: 'Internal server error'
    });
  }
}
