import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables or use defaults
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://lqpoiudemmnacaizemgf.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxcG9pdWRlbW1uYWNhaXplbWdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2OTY5NjAsImV4cCI6MjA3MzI3Mjk2MH0.Mqu4v3tHEf_numtoTx90xPsoMRH4EB83I0RPMGWP3DQ';

// Validate the URL format
if (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}. Must be a valid HTTP or HTTPS URL.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          user_type: 'customer' | 'technician';
          avatar_url: string | null;
          bio: string | null;
          years_experience: number | null;
          hourly_rate: number | null;
          languages: string[] | null;
          specialties: string[] | null;
          emirates_id: string | null;
          trade_license: string | null;
          insurance_document: string | null;
          is_verified: boolean;
          rating: number;
          total_jobs: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          user_type: 'customer' | 'technician';
          avatar_url?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          hourly_rate?: number | null;
          languages?: string[] | null;
          specialties?: string[] | null;
          emirates_id?: string | null;
          trade_license?: string | null;
          insurance_document?: string | null;
          is_verified?: boolean;
          rating?: number;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          user_type?: 'customer' | 'technician';
          avatar_url?: string | null;
          bio?: string | null;
          years_experience?: number | null;
          hourly_rate?: number | null;
          languages?: string[] | null;
          specialties?: string[] | null;
          emirates_id?: string | null;
          trade_license?: string | null;
          insurance_document?: string | null;
          is_verified?: boolean;
          rating?: number;
          total_jobs?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          customer_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          budget: number;
          urgency: 'low' | 'medium' | 'high';
          preferred_date: string;
          status: 'open' | 'in_progress' | 'completed' | 'cancelled';
          images: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          budget: number;
          urgency: 'low' | 'medium' | 'high';
          preferred_date: string;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          budget?: number;
          urgency?: 'low' | 'medium' | 'high';
          preferred_date?: string;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          images?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      bids: {
        Row: {
          id: string;
          job_id: string;
          technician_id: string;
          price: number;
          estimated_time: string;
          message: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          technician_id: string;
          price: number;
          estimated_time: string;
          message: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          technician_id?: string;
          price?: number;
          estimated_time?: string;
          message?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          job_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
