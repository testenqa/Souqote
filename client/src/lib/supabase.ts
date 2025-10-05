import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please create a .env file in the client directory with:');
  console.error('REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co');
  console.error('REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here');
  console.error('');
  console.error('Get these values from your Supabase project dashboard at https://supabase.com');
  console.error('See env.example for reference.');
}

// Validate the URL format
if (supabaseUrl && !supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://')) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}. Must be a valid HTTP or HTTPS URL.`);
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);

// Database types for RFQ Platform
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
          user_type: 'buyer' | 'vendor' | 'admin';
          avatar_url: string | null;
          bio: string | null;
          company_name: string | null;
          business_license: string | null;
          tax_id: string | null;
          languages: string[] | null;
          specialties: string[] | null;
          is_verified: boolean;
          rating: number;
          total_rfqs: number;
          total_quotes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string;
          user_type: 'buyer' | 'vendor' | 'admin';
          avatar_url?: string | null;
          bio?: string | null;
          company_name?: string | null;
          business_license?: string | null;
          tax_id?: string | null;
          languages?: string[] | null;
          specialties?: string[] | null;
          is_verified?: boolean;
          rating?: number;
          total_rfqs?: number;
          total_quotes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          user_type?: 'buyer' | 'vendor' | 'admin';
          avatar_url?: string | null;
          bio?: string | null;
          company_name?: string | null;
          business_license?: string | null;
          tax_id?: string | null;
          languages?: string[] | null;
          specialties?: string[] | null;
          is_verified?: boolean;
          rating?: number;
          total_rfqs?: number;
          total_quotes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      rfqs: {
        Row: {
          id: string;
          buyer_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          budget_min: number | null;
          budget_max: number | null;
          urgency: 'low' | 'medium' | 'high';
          deadline: string;
          status: 'open' | 'in_progress' | 'awarded' | 'cancelled' | 'expired';
          images: string[] | null;
          specifications: string | null;
          requirements: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          budget_min?: number | null;
          budget_max?: number | null;
          urgency?: 'low' | 'medium' | 'high';
          deadline: string;
          status?: 'open' | 'in_progress' | 'awarded' | 'cancelled' | 'expired';
          images?: string[] | null;
          specifications?: string | null;
          requirements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          budget_min?: number | null;
          budget_max?: number | null;
          urgency?: 'low' | 'medium' | 'high';
          deadline?: string;
          status?: 'open' | 'in_progress' | 'awarded' | 'cancelled' | 'expired';
          images?: string[] | null;
          specifications?: string | null;
          requirements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          rfq_id: string;
          vendor_id: string;
          price: number;
          currency: string;
          validity_period: number;
          delivery_time: string;
          message: string;
          terms_conditions: string | null;
          status: 'pending' | 'accepted' | 'rejected' | 'expired';
          attachments: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          vendor_id: string;
          price: number;
          currency?: string;
          validity_period?: number;
          delivery_time: string;
          message: string;
          terms_conditions?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired';
          attachments?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rfq_id?: string;
          vendor_id?: string;
          price?: number;
          currency?: string;
          validity_period?: number;
          delivery_time?: string;
          message?: string;
          terms_conditions?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'expired';
          attachments?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name_en: string;
          name_ar: string;
          description_en: string | null;
          description_ar: string | null;
          icon: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name_en: string;
          name_ar: string;
          description_en?: string | null;
          description_ar?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name_en?: string;
          name_ar?: string;
          description_en?: string | null;
          description_ar?: string | null;
          icon?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          rfq_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          rfq_id?: string;
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
          rfq_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          rfq_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read: boolean;
          data: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          type: string;
          is_read?: boolean;
          data?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_read?: boolean;
          data?: any | null;
          created_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          rfq_id: string;
          buyer_id: string;
          vendor_id: string;
          amount: number;
          commission_amount: number;
          status: string;
          payment_method: string;
          transaction_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          rfq_id: string;
          buyer_id: string;
          vendor_id: string;
          amount: number;
          commission_amount: number;
          status?: string;
          payment_method: string;
          transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          rfq_id?: string;
          buyer_id?: string;
          vendor_id?: string;
          amount?: number;
          commission_amount?: number;
          status?: string;
          payment_method?: string;
          transaction_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
