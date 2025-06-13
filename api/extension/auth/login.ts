import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { returnUrl } = req.body;

    // Generate a secure state parameter for OAuth flow
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);

    // Create the login URL with extension-specific redirect
    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:5173';
    const redirectUrl = `${baseUrl}/extension-auth`;
    
    // Build the login URL with state parameter
    const loginUrl = `${baseUrl}/auth?mode=extension&state=${state}&redirect=${encodeURIComponent(redirectUrl)}`;

    return res.status(200).json({
      loginUrl,
      state,
      success: true
    });

  } catch (error) {
    console.error('Extension login URL generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
