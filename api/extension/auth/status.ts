import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

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
        authenticated: false,
        error: 'No valid authorization token'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return res.status(401).json({
        authenticated: false,
        error: 'Invalid token'
      });
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
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

    // Determine subscription plan and status
    const subscriptionData = subscription ? {
      plan: subscription.plan_name || 'free',
      status: subscription.status || 'active',
      expires_at: subscription.current_period_end,
      created_at: subscription.created_at,
      stripe_customer_id: subscription.stripe_customer_id,
      stripe_subscription_id: subscription.stripe_subscription_id
    } : {
      plan: 'free',
      status: 'active',
      expires_at: null,
      created_at: null,
      stripe_customer_id: null,
      stripe_subscription_id: null
    };

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: profile?.full_name || user.email?.split('@')[0] || 'User',
        avatar_url: profile?.avatar_url,
        created_at: user.created_at
      },
      subscription: subscriptionData
    });

  } catch (error) {
    console.error('Extension auth status error:', error);
    return res.status(500).json({
      authenticated: false,
      error: 'Internal server error'
    });
  }
}
