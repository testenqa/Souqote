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
  user_type: 'buyer' | 'vendor';
  password: string;
  company_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default context instead of throwing an error
    // This allows components to be used outside of AuthProvider (like public routes)
    return {
      user: null,
      token: null,
      login: async () => { throw new Error('Not authenticated'); },
      register: async () => { throw new Error('Not authenticated'); },
      logout: () => {},
      loading: false,
      isAuthenticated: false,
      updateProfile: async () => { throw new Error('Not authenticated'); },
    };
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
    // Initialize auth with session data (fast, no database calls)
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          // Try to fetch user profile from database with timeout
          try {
            const profilePromise = supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const timeoutPromise = new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 1000)
            );
            
            const { data: userProfile, error: profileError } = await Promise.race([
              profilePromise, 
              timeoutPromise
            ]) as any;
            
            if (userProfile && !profileError) {
              setUser(userProfile as User);
            } else {
              throw new Error('Profile fetch failed');
            }
          } catch (error) {
            console.log('Using session metadata fallback:', error);
            // Fallback to user metadata from session if profile fetch fails
            const basicUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              phone: session.user.user_metadata?.phone || '',
              user_type: session.user.user_metadata?.user_type || 'buyer',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              bio: null,
              company_name: session.user.user_metadata?.company_name || null,
              business_license: null,
              tax_id: null,
              languages: null,
              specialties: null,
              is_verified: false,
              rating: 0,
              total_rfqs: 0,
              total_quotes: 0,
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            setUser(basicUser);
          }
          setToken(session.access_token);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Try to fetch user profile from database with timeout
          try {
            const profilePromise = supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            const timeoutPromise = new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Profile fetch timeout')), 1000)
            );
            
            const { data: userProfile, error: profileError } = await Promise.race([
              profilePromise, 
              timeoutPromise
            ]) as any;
            
            if (userProfile && !profileError) {
              setUser(userProfile as User);
            } else {
              throw new Error('Profile fetch failed');
            }
          } catch (error) {
            console.log('Using session metadata fallback:', error);
            // Fallback to user metadata from session if profile fetch fails
            const basicUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              first_name: session.user.user_metadata?.first_name || '',
              last_name: session.user.user_metadata?.last_name || '',
              phone: session.user.user_metadata?.phone || '',
              user_type: session.user.user_metadata?.user_type || 'buyer',
              avatar_url: session.user.user_metadata?.avatar_url || null,
              bio: null,
              company_name: session.user.user_metadata?.company_name || null,
              business_license: null,
              tax_id: null,
              languages: null,
              specialties: null,
              is_verified: false,
              rating: 0,
              total_rfqs: 0,
              total_quotes: 0,
              created_at: session.user.created_at || new Date().toISOString(),
              updated_at: new Date().toISOString()
            };
            
            setUser(basicUser);
          }
          setToken(session.access_token);
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
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
        // Fetch complete user profile from database
        const { data: userProfile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (userProfile && !profileError) {
          setUser(userProfile as User);
        } else {
          // Fallback to basic user object from session if profile fetch fails
          const basicUser: User = {
            id: data.user.id,
            email: data.user.email || '',
            first_name: data.user.user_metadata?.first_name || '',
            last_name: data.user.user_metadata?.last_name || '',
            phone: data.user.user_metadata?.phone || '',
            user_type: data.user.user_metadata?.user_type || 'buyer',
            avatar_url: data.user.user_metadata?.avatar_url || null,
            bio: null,
            company_name: data.user.user_metadata?.company_name || null,
            business_license: null,
            tax_id: null,
            languages: null,
            specialties: null,
            is_verified: false,
            rating: 0,
            total_rfqs: 0,
            total_quotes: 0,
            created_at: data.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setUser(basicUser);
        }
        
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
      
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          emailRedirectTo: 'https://souqote.vercel.app/auth/callback',
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            phone: userData.phone,
            user_type: userData.user_type,
            company_name: userData.company_name,
          }
        }
      });

      if (error) {
        if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
          throw new Error('Too many registration attempts. Please wait a few minutes before trying again.');
        } else if (error.message.includes('User already registered')) {
          throw new Error('An account with this email already exists. Please try logging in instead.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.user) {
        // Try to create user profile in database
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: userData.email,
              first_name: userData.first_name,
              last_name: userData.last_name,
              phone: userData.phone,
              user_type: userData.user_type,
              avatar_url: null,
              bio: null,
              company_name: userData.company_name || null,
              business_license: null,
              tax_id: null,
              languages: null,
              specialties: null,
              is_verified: false,
              rating: 0.0,
              total_rfqs: 0,
              total_quotes: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Database error saving new user:', profileError);
            // Don't throw error, just log it - user can still proceed
          }
        } catch (dbError) {
          console.error('Database error saving new user:', dbError);
          // Don't throw error, just log it - user can still proceed
        }
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw new Error('Failed to update profile');
      }

      setUser({ ...user, ...updates });
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
