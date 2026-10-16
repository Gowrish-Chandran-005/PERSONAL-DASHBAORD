import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import type { Database } from '../types/database.types';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: AuthError | null; unconfirmed?: boolean }>;
  signOut: () => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const loadOrCreateProfile = useCallback(async (currentUser: User) => {
    try {
      // 1. Attempt to fetch existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (fetchError) {
        console.warn('Could not fetch user profile:', fetchError.message);
      }

      if (existingProfile) {
        setProfile(existingProfile);
        return;
      }

      // 2. Profile not found - provision using the verified profiles_insert policy
      const displayName =
        currentUser.user_metadata?.full_name ||
        currentUser.user_metadata?.display_name ||
        currentUser.email?.split('@')[0] ||
        'User';

      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          display_name: displayName,
          role: 'member', // Strictly member as enforced by trg_profiles_role_check
          timezone_name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          preferences: {},
        })
        .select()
        .maybeSingle();

      if (insertError) {
        console.warn('Could not provision initial profile:', insertError.message);
      } else if (newProfile) {
        setProfile(newProfile);
      }
    } catch (err) {
      console.error('Unexpected error loading profile:', err);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    await loadOrCreateProfile(user);
  }, [user, loadOrCreateProfile]);

  useEffect(() => {
    let mounted = true;

    // Initial session retrieval
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!mounted) return;
      if (error) {
        setAuthError(error.message);
        setLoading(false);
        return;
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (initialSession?.user) {
        loadOrCreateProfile(initialSession.user).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setAuthError(null);

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (currentSession?.user) {
            await loadOrCreateProfile(currentSession.user);
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadOrCreateProfile]);

  const signIn = async (email: string, password: string) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    if (data.user) {
      await loadOrCreateProfile(data.user);
    }
    return { error: null };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName || email.split('@')[0],
        },
      },
    });

    if (error) {
      setAuthError(error.message);
      return { error };
    }

    const unconfirmed = !data.session && !!data.user;
    if (data.user && data.session) {
      await loadOrCreateProfile(data.user);
    }
    return { error: null, unconfirmed };
  };

  const signOut = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      return { error };
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        authError,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
