import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { AuthContextType, User, Profile, Subscription } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode configuration
const DEMO_MODE = true;

const demoUser: User = {
  id: 'demo-user-123',
  email: 'demo@extensionpro.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoAdmin: User = {
  id: 'admin-user-456',
  email: 'admin@extensionpro.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoProfile: Profile = {
  id: 'demo-user-123',
  email: 'demo@extensionpro.com',
  full_name: 'John Doe',
  company: 'Demo Company',
  bio: 'This is a demo account for testing purposes.',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoAdminProfile: Profile = {
  id: 'admin-user-456',
  email: 'admin@extensionpro.com',
  full_name: 'Admin User',
  company: 'ExtensionPro',
  bio: 'Platform administrator',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoSubscription: Subscription = {
  id: 'demo-sub-123',
  user_id: 'demo-user-123',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  plan_name: 'pro',
  status: 'active',
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at
        });
        loadUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at
          });
          await loadUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setSubscription(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Load subscription
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    if (DEMO_MODE) {
      setUser(demoUser);
      setProfile(demoProfile);
      setSubscription(demoSubscription);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const adminSignIn = async (email: string, password: string) => {
    if (DEMO_MODE && email === 'admin@extensionpro.com' && password === 'admin123') {
      setUser(demoAdmin);
      setProfile(demoAdminProfile);
      setSubscription(null);
      setIsAdmin(true);
      setLoading(false);
    } else {
      throw new Error('Invalid admin credentials');
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEMO_MODE) {
      throw new Error('Demo mode: Use "Demo Login" button instead');
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    if (DEMO_MODE) {
      throw new Error('Demo mode: Use "Demo Login" button instead');
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      // Create free subscription
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: data.user.id,
          plan_name: 'free',
          status: 'active',
        });

      if (subscriptionError) {
        console.error('Error creating subscription:', subscriptionError);
      }
    }
  };

  const signOut = async () => {
    if (DEMO_MODE) {
      setUser(null);
      setProfile(null);
      setSubscription(null);
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    if (DEMO_MODE) {
      // Update demo profile in memory
      setProfile(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      throw error;
    }

    // Reload profile data
    await loadUserData(user.id);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        subscription,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        updateProfile,
        demoLogin,
        adminSignIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
