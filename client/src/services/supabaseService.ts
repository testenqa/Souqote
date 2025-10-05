import { supabase } from '../lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '../lib/supabase';

// Auth functions
export const authService = {
  async signUp(email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone: string;
    userType: 'buyer' | 'vendor';
    companyName?: string;
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          user_type: userData.userType,
          company_name: userData.companyName,
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        user_type: userData.userType,
        company_name: userData.companyName || null,
      });

    if (profileError) throw profileError;

    return authData;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateUserProfile(userId: string, updates: TablesUpdate<'users'>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// RFQ functions
export const rfqService = {
  async createRFQ(rfqData: TablesInsert<'rfqs'>) {
    const { data, error } = await supabase
      .from('rfqs')
      .insert(rfqData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getRFQs(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('rfqs')
      .select(`
        *,
        buyer:users!rfqs_buyer_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async getRFQById(rfqId: string) {
    const { data, error } = await supabase
      .from('rfqs')
      .select(`
        *,
        buyer:users!rfqs_buyer_id_fkey(*)
      `)
      .eq('id', rfqId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserRFQs(userId: string) {
    const { data, error } = await supabase
      .from('rfqs')
      .select(`
        *,
        buyer:users!rfqs_buyer_id_fkey(*)
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateRFQ(rfqId: string, updates: TablesUpdate<'rfqs'>) {
    const { data, error } = await supabase
      .from('rfqs')
      .update(updates)
      .eq('id', rfqId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRFQ(rfqId: string) {
    const { error } = await supabase
      .from('rfqs')
      .delete()
      .eq('id', rfqId);

    if (error) throw error;
  }
};

// Quotes functions
export const quotesService = {
  async createQuote(quoteData: TablesInsert<'quotes'>) {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quoteData)
      .select(`
        *,
        vendor:users!quotes_vendor_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getRFQQuotes(rfqId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        vendor:users!quotes_vendor_id_fkey(*)
      `)
      .eq('rfq_id', rfqId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getUserQuotes(userId: string) {
    const { data, error } = await supabase
      .from('quotes')
      .select(`
        *,
        rfq:rfqs!quotes_rfq_id_fkey(*),
        vendor:users!quotes_vendor_id_fkey(*)
      `)
      .eq('vendor_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateQuote(quoteId: string, updates: TablesUpdate<'quotes'>) {
    const { data, error } = await supabase
      .from('quotes')
      .update(updates)
      .eq('id', quoteId)
      .select(`
        *,
        vendor:users!quotes_vendor_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async acceptQuote(quoteId: string) {
    // First, reject all other quotes for this RFQ
    const { data: quoteData } = await supabase
      .from('quotes')
      .select('rfq_id')
      .eq('id', quoteId)
      .single();

    if (quoteData) {
      await supabase
        .from('quotes')
        .update({ status: 'rejected' })
        .eq('rfq_id', quoteData.rfq_id)
        .neq('id', quoteId);
    }

    // Accept the selected quote
    const { data, error } = await supabase
      .from('quotes')
      .update({ status: 'accepted' })
      .eq('id', quoteId)
      .select(`
        *,
        vendor:users!quotes_vendor_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    // Update RFQ status to awarded
    if (data) {
      await supabase
        .from('rfqs')
        .update({ status: 'awarded' })
        .eq('id', data.rfq_id);
    }

    return data;
  }
};

// Messages functions
export const messagesService = {
  async sendMessage(messageData: TablesInsert<'messages'>) {
    const { data, error } = await supabase
      .from('messages')
      .insert(messageData)
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getRFQMessages(rfqId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*)
      `)
      .eq('rfq_id', rfqId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async markMessageAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);

    if (error) throw error;
  }
};

// Reviews functions
export const reviewsService = {
  async createReview(reviewData: TablesInsert<'reviews'>) {
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(*),
        reviewee:users!reviews_reviewee_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserReviews(userId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:users!reviews_reviewer_id_fkey(*),
        reviewee:users!reviews_reviewee_id_fkey(*),
        rfq:rfqs!reviews_rfq_id_fkey(*)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtimeService = {
  subscribeToRFQQuotes(rfqId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`rfq-quotes-${rfqId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'quotes',
        filter: `rfq_id=eq.${rfqId}`
      }, callback)
      .subscribe();
  },

  subscribeToRFQMessages(rfqId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`rfq-messages-${rfqId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `rfq_id=eq.${rfqId}`
      }, callback)
      .subscribe();
  },

  subscribeToUserRFQs(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-rfqs-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rfqs',
        filter: `buyer_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
};
