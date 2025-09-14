export interface User {
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
  is_verified: boolean;
  rating: number;
  total_jobs: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  emirates_id?: string;
  trade_license?: string;
  insurance_document?: string;
  years_experience?: number;
  hourly_rate?: number;
  languages?: string[];
  specialties?: string[];
  availability?: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
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
  images?: string[] | null;
  created_at: string;
  updated_at: string;
  customer?: User;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  job_id: string;
  technician_id: string;
  price: number;
  estimated_time: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  technician?: User;
}

export interface JobApplication {
  id: string;
  job_id: string;
  professional_id: string;
  message: string;
  proposed_price: number;
  estimated_duration: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  professional?: User;
}

export interface Category {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  icon?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string | null;
  created_at: string;
  reviewer?: User;
  reviewee?: User;
}

export interface Message {
  id: string;
  job_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
  receiver?: User;
}

export interface Payment {
  id: string;
  job_id: string;
  customer_id: string;
  professional_id: string;
  amount: number;
  commission_amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  transaction_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_application' | 'job_accepted' | 'job_completed' | 'message' | 'review' | 'payment';
  is_read: boolean;
  data?: any;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface SearchFilters {
  category_id?: string;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  rating_min?: number;
  availability?: string;
  languages?: string[];
}

export interface JobFormData {
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
  images?: File[];
}

export interface ApplicationFormData {
  message: string;
  proposed_price: number;
  estimated_duration: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ProfileFormData {
  bio?: string;
  location?: string;
  emirates_id?: string;
  trade_license?: string;
  insurance_document?: string;
  years_experience?: number;
  hourly_rate?: number;
  languages?: string[];
  specialties?: string[];
  availability?: string;
}
