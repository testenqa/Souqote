import { supabase } from '../config/database';
import { Job, JobApplication, SearchFilters, PaginationParams } from '../types';

export class JobService {
  static async createJob(jobData: {
    customer_id: string;
    title: string;
    description: string;
    category_id: string;
    location: string;
    latitude?: number;
    longitude?: number;
    budget_min?: number;
    budget_max?: number;
    preferred_date?: string;
    urgency: 'low' | 'medium' | 'high';
    images?: string[];
  }): Promise<Job> {
    const { data: job, error } = await supabase
      .from('jobs')
      .insert({
        ...jobData,
        status: 'open'
      })
      .select(`
        *,
        customer:users(*),
        category:categories(*),
        applications:job_applications(*)
      `)
      .single();

    if (error) {
      throw new Error('Failed to create job');
    }

    return job;
  }

  static async getJobs(
    filters: SearchFilters = {},
    pagination: PaginationParams = {}
  ): Promise<{ jobs: Job[]; total: number }> {
    const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = pagination;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('jobs')
      .select(`
        *,
        customer:users(*),
        category:categories(*),
        applications:job_applications(*)
      `, { count: 'exact' })
      .eq('status', 'open');

    // Apply filters
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.budget_min) {
      query = query.gte('budget_min', filters.budget_min);
    }

    if (filters.budget_max) {
      query = query.lte('budget_max', filters.budget_max);
    }

    // Apply sorting
    query = query.order(sort_by, { ascending: sort_order === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: jobs, error, count } = await query;

    if (error) {
      throw new Error('Failed to fetch jobs');
    }

    return {
      jobs: jobs || [],
      total: count || 0
    };
  }

  static async getJobById(jobId: string): Promise<Job | null> {
    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:users(*),
        category:categories(*),
        applications:job_applications(
          *,
          professional:users(*)
        )
      `)
      .eq('id', jobId)
      .single();

    if (error) {
      return null;
    }

    return job;
  }

  static async updateJob(jobId: string, updates: Partial<Job>): Promise<Job> {
    const { data: job, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', jobId)
      .select(`
        *,
        customer:users(*),
        category:categories(*),
        applications:job_applications(*)
      `)
      .single();

    if (error) {
      throw new Error('Failed to update job');
    }

    return job;
  }

  static async deleteJob(jobId: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) {
      throw new Error('Failed to delete job');
    }
  }

  static async applyForJob(applicationData: {
    job_id: string;
    professional_id: string;
    message: string;
    proposed_price: number;
    estimated_duration: string;
  }): Promise<JobApplication> {
    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_id', applicationData.job_id)
      .eq('professional_id', applicationData.professional_id)
      .single();

    if (existingApplication) {
      throw new Error('Already applied for this job');
    }

    const { data: application, error } = await supabase
      .from('job_applications')
      .insert({
        ...applicationData,
        status: 'pending'
      })
      .select(`
        *,
        professional:users(*)
      `)
      .single();

    if (error) {
      throw new Error('Failed to apply for job');
    }

    return application;
  }

  static async getJobApplications(jobId: string): Promise<JobApplication[]> {
    const { data: applications, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        professional:users(*)
      `)
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch job applications');
    }

    return applications || [];
  }

  static async acceptApplication(applicationId: string): Promise<void> {
    // Get the application
    const { data: application, error: fetchError } = await supabase
      .from('job_applications')
      .select('job_id, professional_id')
      .eq('id', applicationId)
      .single();

    if (fetchError || !application) {
      throw new Error('Application not found');
    }

    // Update application status
    const { error: updateError } = await supabase
      .from('job_applications')
      .update({ status: 'accepted' })
      .eq('id', applicationId);

    if (updateError) {
      throw new Error('Failed to accept application');
    }

    // Update job status
    const { error: jobError } = await supabase
      .from('jobs')
      .update({ 
        status: 'in_progress',
        professional_id: application.professional_id
      })
      .eq('id', application.job_id);

    if (jobError) {
      throw new Error('Failed to update job status');
    }

    // Reject other applications
    await supabase
      .from('job_applications')
      .update({ status: 'rejected' })
      .eq('job_id', application.job_id)
      .neq('id', applicationId);
  }

  static async completeJob(jobId: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'completed' })
      .eq('id', jobId);

    if (error) {
      throw new Error('Failed to complete job');
    }
  }

  static async getUserJobs(userId: string, userType: 'customer' | 'professional'): Promise<Job[]> {
    const column = userType === 'customer' ? 'customer_id' : 'professional_id';
    
    const { data: jobs, error } = await supabase
      .from('jobs')
      .select(`
        *,
        customer:users(*),
        professional:users(*),
        category:categories(*),
        applications:job_applications(*)
      `)
      .eq(column, userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch user jobs');
    }

    return jobs || [];
  }
}
