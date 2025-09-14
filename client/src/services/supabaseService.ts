import { supabase } from '../lib/supabase';
import { Tables, TablesInsert, TablesUpdate } from '../lib/supabase';

// Auth functions
export const authService = {
  async signUp(email: string, password: string, userData: {
    firstName: string;
    lastName: string;
    phone: string;
    userType: 'customer' | 'technician';
  }) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
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

// Jobs functions
export const jobsService = {
  async createJob(jobData: TablesInsert<'jobs'>) {
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getJobs(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }) {
    let query = supabase
      .from('jobs')
      .select(`
        *,
        customer:users!jobs_customer_id_fkey(*)
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

  async getJobById(jobId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:users!jobs_customer_id_fkey(*)
      `)
      .eq('id', jobId)
      .single();

    if (error) throw error;
    return data;
  },

  async getUserJobs(userId: string) {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:users!jobs_customer_id_fkey(*)
      `)
      .eq('customer_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateJob(jobId: string, updates: TablesUpdate<'jobs'>) {
    const { data, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteJob(jobId: string) {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  }
};

// Bids functions
export const bidsService = {
  async createBid(bidData: TablesInsert<'bids'>) {
    const { data, error } = await supabase
      .from('bids')
      .insert(bidData)
      .select(`
        *,
        technician:users!bids_technician_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async getJobBids(jobId: string) {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        technician:users!bids_technician_id_fkey(*)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getUserBids(userId: string) {
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        job:jobs!bids_job_id_fkey(*),
        technician:users!bids_technician_id_fkey(*)
      `)
      .eq('technician_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateBid(bidId: string, updates: TablesUpdate<'bids'>) {
    const { data, error } = await supabase
      .from('bids')
      .update(updates)
      .eq('id', bidId)
      .select(`
        *,
        technician:users!bids_technician_id_fkey(*)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async acceptBid(bidId: string) {
    // First, reject all other bids for this job
    const { data: bidData } = await supabase
      .from('bids')
      .select('job_id')
      .eq('id', bidId)
      .single();

    if (bidData) {
      await supabase
        .from('bids')
        .update({ status: 'rejected' })
        .eq('job_id', bidData.job_id)
        .neq('id', bidId);
    }

    // Accept the selected bid
    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'accepted' })
      .eq('id', bidId)
      .select(`
        *,
        technician:users!bids_technician_id_fkey(*)
      `)
      .single();

    if (error) throw error;

    // Update job status to in_progress
    if (data) {
      await supabase
        .from('jobs')
        .update({ status: 'in_progress' })
        .eq('id', data.job_id);
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

  async getJobMessages(jobId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*)
      `)
      .eq('job_id', jobId)
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
        job:jobs!reviews_job_id_fkey(*)
      `)
      .eq('reviewee_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};

// Real-time subscriptions
export const realtimeService = {
  subscribeToJobBids(jobId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`job-bids-${jobId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bids',
        filter: `job_id=eq.${jobId}`
      }, callback)
      .subscribe();
  },

  subscribeToJobMessages(jobId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`job-messages-${jobId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `job_id=eq.${jobId}`
      }, callback)
      .subscribe();
  },

  subscribeToUserJobs(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`user-jobs-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'jobs',
        filter: `customer_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
};
