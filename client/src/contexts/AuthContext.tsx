import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

interface RegisterData {
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  user_type: 'customer' | 'professional';
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for Supabase session on app load
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error getting user profile:', profileError);
            setLoading(false);
            return;
          }

          setUser(profile);
          setToken(session.access_token);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Get user profile from database
          const { data: profile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profile) {
            setUser(profile);
            setToken(session.access_token);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setToken(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before logging in.');
        } else if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          throw new Error('Too many login attempts. Please wait a few minutes before trying again.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        // Get user profile from database
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          throw new Error('Failed to get user profile');
        }

        setUser(profile);
        setToken(data.session?.access_token || null);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            user_type: userData.user_type === 'professional' ? 'technician' : 'customer',
          }
        }
      });

      if (authError) {
        // Handle specific error cases
        if (authError.message.includes('429') || authError.message.includes('Too Many Requests')) {
          throw new Error('Too many registration attempts. Please wait a few minutes before trying again.');
        } else if (authError.message.includes('already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        } else if (authError.message.includes('Invalid email')) {
          throw new Error('Please enter a valid email address.');
        } else if (authError.message.includes('Password should be at least')) {
          throw new Error('Password must be at least 6 characters long.');
        } else {
          throw new Error(authError.message);
        }
      }

      if (authData.user) {
        // Create user profile manually in public.users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            user_type: userData.user_type === 'professional' ? 'technician' : 'customer',
            avatar_url: null,
            bio: null,
            years_experience: null,
            hourly_rate: null,
            languages: ['English'],
            specialties: null,
            emirates_id: null,
            trade_license: null,
            insurance_document: null,
            is_verified: false,
            rating: 0.0,
            total_jobs: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          // If profile creation fails, still allow registration but with limited functionality
          const tempUser: User = {
            id: authData.user.id,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            user_type: userData.user_type === 'professional' ? 'technician' : 'customer',
            avatar_url: null,
            bio: null,
            years_experience: null,
            hourly_rate: null,
            languages: ['English'],
            specialties: null,
            emirates_id: null,
            trade_license: null,
            insurance_document: null,
            is_verified: false,
            rating: 0,
            total_jobs: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setUser(tempUser);
        } else {
          setUser(profile as User);
        }
        
        setToken(authData.session?.access_token || null);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if Supabase logout fails
      setUser(null);
      setToken(null);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) throw new Error('No user logged in');
    
    try {
      setLoading(true);
      
      // Update user in database
      const { data: updatedUser, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error('Failed to update profile');
      }

      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user && !!token,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
