import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile, Subscription } from '../lib/supabase';
import type { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo mode configuration - can be toggled
const DEMO_MODE = false;

const demoUser: User = {
  id: 'demo-user-123',
  email: 'demo@styleinspectorpro.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoAdmin: User = {
  id: 'admin-user-456',
  email: 'admin@styleinspectorpro.com',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoProfile: Profile = {
  id: 'demo-user-123',
  email: 'demo@styleinspectorpro.com',
  full_name: 'John Doe',
  company: 'Frontend Studio',
  bio: 'Frontend developer passionate about CSS and web performance.',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

const demoAdminProfile: Profile = {
  id: 'admin-user-456',
  email: 'admin@styleinspectorpro.com',
  full_name: 'Admin User',
  company: 'Style Inspector Pro',
  bio: 'Platform administrator for CSS debugging tools',
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(DEMO_MODE);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(session);
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
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at
          });
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setSubscription(null);
          setIsAdmin(false);
          setIsDemoMode(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      // Load profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      } else if (profileData) {
        setProfile(profileData);
      }

      // Load subscription
      const { data: subscriptionData, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.error('Error fetching subscription:', subscriptionError);
      } else if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Demo mode functions
  const enableDemoMode = () => {
    setIsDemoMode(true);
    setUser(demoUser);
    setProfile(demoProfile);
    setSubscription(demoSubscription);
    setIsAdmin(false);
    setLoading(false);
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    setUser(null);
    setProfile(null);
    setSubscription(null);
    setIsAdmin(false);
  };

  const demoLogin = async () => {
    // First sign out any existing session
    await supabase.auth.signOut();
    // Then enable demo mode
    enableDemoMode();
  };

  const adminSignIn = async (email: string, password: string) => {
    if (isDemoMode && email === 'admin@styleinspectorpro.com' && password === 'admin123') {
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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    if (error) {
      throw error;
    }

    // Profile and subscription will be created automatically by database triggers
    // or we can create them here if needed
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
    if (isDemoMode) {
      // For demo mode, just disable demo mode
      setIsDemoMode(false);
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setIsAdmin(false);
    } else {
      // For real users, sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    if (isDemoMode) {
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

    // Update local state
    setProfile(prev => prev ? { ...prev, ...data, updated_at: new Date().toISOString() } : null);
  };

  const refreshSubscription = async () => {
    if (!user || isDemoMode) return;

    try {
      const { data: subscriptionData, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
      } else if (subscriptionData) {
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: isDemoMode ? demoUser : user,
        profile: isDemoMode ? demoProfile : profile,
        subscription: isDemoMode ? demoSubscription : subscription,
        session: isDemoMode ? null : session,
        loading,
        isAdmin,
        isDemoMode,
        signIn,
        signUp,
        signOut,
        updateProfile,
        refreshSubscription,
        demoLogin,
        adminSignIn,
        enableDemoMode,
        disableDemoMode,
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
