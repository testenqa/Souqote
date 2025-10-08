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

export interface RFQItem {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  specifications?: string;
  preferred_brand?: string;
  acceptable_alternatives?: boolean;
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
  // New enhanced fields
  rfq_reference?: string;
  items?: RFQItem[];
  payment_terms?: string;
  delivery_terms?: string;
  delivery_date?: string;
  delivery_location?: string;
  vat_applicable?: boolean;
  vat_rate?: number;
  quotation_validity_days?: number;
  warranty_requirements?: string;
  installation_required?: boolean;
  installation_specifications?: string;
  currency?: string;
  terms_conditions?: string;
  contact_person_name?: string;
  contact_person_role?: string;
  contact_person_phone?: string;
  project_reference?: string;
  service_type?: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
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
  quote_id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  attachments?: string[];
  thread_id?: string;
  created_at: string;
  updated_at?: string;
  sender?: User;
  receiver?: User;
}

export interface ConversationThread {
  rfq_id: string;
  quote_id?: string;
  sender_id: string;
  receiver_id: string;
  thread_id: string;
  message_count: number;
  unread_count: number;
  last_message_at: string;
  last_message: string;
  other_user?: User;
  rfq?: RFQ;
  quote?: Quote;
}

export interface MessageFormData {
  content: string;
  attachments?: File[];
}

// ============================================================================
// VENDOR ONBOARDING & VERIFICATION TYPES
// ============================================================================

export type VendorVerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected' | 'expired';
export type CompanyType = 'LLC' | 'Sole_Proprietorship' | 'Branch' | 'Free_Zone' | 'Partnership' | 'Other';
export type IssuingAuthority = 'DED' | 'DMCC' | 'DIFC' | 'JAFZA' | 'ADGM' | 'SHAMS' | 'RAK_ICC' | 'Fujairah_Creative_City' | 'Ministry_of_Economy' | 'Other';
export type BusinessCategory = 'Manpower_Supply' | 'MEP_Services' | 'Civil_Works' | 'Facility_Management' | 'HVAC' | 'Plumbing' | 'Electrical' | 'Building_Maintenance' | 'Technical_Services' | 'Engineering_Consultancy' | 'IT_Services' | 'Security_Services' | 'Cleaning_Services' | 'Landscaping' | 'Transportation' | 'Other';
export type Emirates = 'Dubai' | 'Abu_Dhabi' | 'Sharjah' | 'Ajman' | 'Umm_Al_Quwain' | 'Ras_Al_Khaimah' | 'Fujairah';

export interface VendorProfile {
  id: string;
  user_id: string;
  
  // 1. Company Information
  company_name_english: string;
  company_name_arabic?: string;
  trade_license_number: string;
  issuing_authority: IssuingAuthority;
  license_activity?: string;
  license_expiry_date: string;
  establishment_date?: string;
  company_type: CompanyType;
  tax_registration_number?: string;
  
  // 2. Business Location
  registered_office_address: string;
  emirate: Emirates;
  branch_locations?: string[];
  google_maps_url?: string;
  makani_number?: string;
  
  // 3. Authorized Contact Details
  authorized_person_name: string;
  designation?: string;
  business_email: string;
  business_phone: string;
  whatsapp_number?: string;
  company_website?: string;
  linkedin_url?: string;
  social_media_links?: string[];
  
  // 4. Ownership / Management Info
  company_owner_names?: string[];
  owner_nationalities?: string[];
  manager_name?: string;
  authorized_signatory_name?: string;
  
  // 5. Business Operations & Capabilities
  business_category: BusinessCategory;
  main_services_offered: string[];
  trade_license_activity_codes?: string[];
  years_experience_uae?: number;
  major_clients?: string[];
  staff_strength?: number;
  certifications?: string[];
  insurance_details?: string;
  health_safety_compliance: boolean;
  labour_supply_approval_number?: string;
  
  // 6. Banking / Payment Info
  bank_name?: string;
  iban?: string;
  account_name?: string;
  
  // 7. Verification & Compliance
  verification_status: VendorVerificationStatus;
  verification_date?: string;
  verification_notes?: string;
  verified_by?: string;
  
  // 8. Optional Metadata
  free_zone_mainland_indicator?: string;
  chamber_of_commerce_number?: string;
  mohre_workers_count?: number;
  preferred_work_locations?: Emirates[];
  languages_spoken?: string[];
  response_sla_hours: number;
  availability_hours?: string;
  
  // Compliance checkboxes
  uae_labour_law_compliance: boolean;
  mohre_requirements_compliance: boolean;
  vat_compliance: boolean;
  
  // Profile completion tracking
  profile_completion_percentage: number;
  is_profile_complete: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relations
  user?: User;
  documents?: VendorDocument[];
  services?: VendorService[];
  vendor_certifications?: VendorCertification[];
  references?: VendorReference[];
}

export interface VendorDocument {
  id: string;
  vendor_profile_id: string;
  document_type: string;
  document_name: string;
  file_url: string;
  file_size?: number;
  mime_type?: string;
  is_verified: boolean;
  verification_notes?: string;
  uploaded_at: string;
}

export interface VendorService {
  id: string;
  vendor_profile_id: string;
  service_name: string;
  service_description?: string;
  years_experience: number;
  hourly_rate?: number;
  daily_rate?: number;
  is_primary_service: boolean;
  created_at: string;
}

export interface VendorCertification {
  id: string;
  vendor_profile_id: string;
  certification_name: string;
  issuing_body?: string;
  certificate_number?: string;
  issue_date?: string;
  expiry_date?: string;
  certificate_url?: string;
  is_verified: boolean;
  created_at: string;
}

export interface VendorReference {
  id: string;
  vendor_profile_id: string;
  client_name: string;
  client_contact_person?: string;
  client_email?: string;
  client_phone?: string;
  project_description?: string;
  project_value?: number;
  project_duration_months?: number;
  completion_date?: string;
  is_verified: boolean;
  created_at: string;
}

// Form data interfaces for multi-step onboarding
export interface VendorOnboardingStep1 {
  company_name_english: string;
  company_name_arabic?: string;
  trade_license_number: string;
  issuing_authority: IssuingAuthority;
  license_activity?: string;
  license_expiry_date: string;
  establishment_date?: string;
  company_type: CompanyType;
  tax_registration_number?: string;
}

export interface VendorOnboardingStep2 {
  registered_office_address: string;
  emirate: Emirates;
  branch_locations?: string[];
  google_maps_url?: string;
  makani_number?: string;
}

export interface VendorOnboardingStep3 {
  authorized_person_name: string;
  designation?: string;
  business_email: string;
  business_phone: string;
  whatsapp_number?: string;
  company_website?: string;
  linkedin_url?: string;
  social_media_links?: string[];
}

export interface VendorOnboardingStep4 {
  company_owner_names?: string[];
  owner_nationalities?: string[];
  manager_name?: string;
  authorized_signatory_name?: string;
}

export interface VendorOnboardingStep5 {
  business_category: BusinessCategory;
  main_services_offered: string[];
  trade_license_activity_codes?: string[];
  years_experience_uae?: number;
  major_clients?: string[];
  staff_strength?: number;
  certifications?: string[];
  insurance_details?: string;
  health_safety_compliance: boolean;
  labour_supply_approval_number?: string;
}

export interface VendorOnboardingStep6 {
  bank_name?: string;
  iban?: string;
  account_name?: string;
}

export interface VendorOnboardingStep7 {
  documents: File[];
  document_types: string[];
}

export interface VendorOnboardingStep8 {
  free_zone_mainland_indicator?: string;
  chamber_of_commerce_number?: string;
  mohre_workers_count?: number;
  preferred_work_locations?: Emirates[];
  languages_spoken?: string[];
  response_sla_hours: number;
  availability_hours?: string;
  uae_labour_law_compliance: boolean;
  mohre_requirements_compliance: boolean;
  vat_compliance: boolean;
}

export interface VendorOnboardingData {
  step1: VendorOnboardingStep1;
  step2: VendorOnboardingStep2;
  step3: VendorOnboardingStep3;
  step4: VendorOnboardingStep4;
  step5: VendorOnboardingStep5;
  step6: VendorOnboardingStep6;
  step7: VendorOnboardingStep7;
  step8: VendorOnboardingStep8;
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
  // New enhanced fields
  rfq_reference?: string;
  items?: RFQItem[];
  payment_terms?: string;
  delivery_terms?: string;
  delivery_date?: string;
  delivery_location?: string;
  vat_applicable?: boolean;
  vat_rate?: number;
  quotation_validity_days?: number;
  warranty_requirements?: string;
  installation_required?: boolean;
  installation_specifications?: string;
  currency?: string;
  terms_conditions?: string;
  contact_person_name?: string;
  contact_person_role?: string;
  contact_person_phone?: string;
  project_reference?: string;
  service_type?: string;
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
