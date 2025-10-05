export interface User {
  id: string;
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
  is_verified: boolean;
  rating: number;
  total_rfqs: number;
  total_quotes: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  avatar_url?: string;
  location?: string;
  company_name?: string;
  business_license?: string;
  tax_id?: string;
  languages?: string[];
  specialties?: string[];
  availability?: string;
  created_at: string;
  updated_at: string;
}

export interface RFQ {
  id: string;
  buyer_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget_min?: number;
  budget_max?: number;
  urgency: 'low' | 'medium' | 'high';
  deadline: string;
  status: 'open' | 'in_progress' | 'awarded' | 'cancelled' | 'expired';
  images?: string[] | null;
  specifications?: string | null;
  requirements?: string[] | null;
  created_at: string;
  updated_at: string;
  buyer?: User;
  quotes?: Quote[];
}

export interface Quote {
  id: string;
  rfq_id: string;
  vendor_id: string;
  price: number;
  currency: string;
  validity_period: number; // in days
  delivery_time: string;
  message: string;
  terms_conditions?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  attachments?: string[] | null;
  created_at: string;
  updated_at: string;
  vendor?: User;
  rfq?: RFQ;
}

export interface RFQApplication {
  id: string;
  rfq_id: string;
  vendor_id: string;
  message: string;
  proposed_price: number;
  estimated_delivery: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
  vendor?: User;
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
  rfq_id: string;
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
  rfq_id: string;
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
  rfq_id: string;
  buyer_id: string;
  vendor_id: string;
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
  type: 'rfq_posted' | 'quote_submitted' | 'quote_accepted' | 'rfq_awarded' | 'message' | 'review' | 'payment';
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
  urgency?: 'low' | 'medium' | 'high';
  languages?: string[];
  specialties?: string[];
}

export interface RFQFormData {
  title: string;
  description: string;
  category_id: string;
  location: string;
  latitude?: number;
  longitude?: number;
  budget_min?: number;
  budget_max?: number;
  deadline?: string;
  urgency: 'low' | 'medium' | 'high';
  specifications?: string;
  requirements?: string[];
  images?: File[];
}

export interface QuoteFormData {
  message: string;
  price: number;
  currency: string;
  validity_period: number;
  delivery_time: string;
  terms_conditions?: string;
  attachments?: File[];
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ProfileFormData {
  bio?: string;
  location?: string;
  company_name?: string;
  business_license?: string;
  tax_id?: string;
  languages?: string[];
  specialties?: string[];
  availability?: string;
}
