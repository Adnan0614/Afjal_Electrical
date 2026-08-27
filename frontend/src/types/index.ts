export interface LeadCreate {
  name: string;
  phone: string;
  email?: string;
  service_type: string;
  equipment_type?: string;
  capacity_hp?: string;
  wire_grade?: string;
  estimated_cost?: number;
  details?: string;
  location?: string;
  source?: string;
  meta_data?: Record<string, any>;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service_type: string;
  equipment_type?: string;
  capacity_hp?: string;
  wire_grade?: string;
  estimated_cost?: number;
  details?: string;
  location?: string;
  source: string;
  meta_data?: Record<string, any>;
  status: string;
  owner_note?: string;
  created_at: string;
  updated_at?: string | null;
}

export interface LeadStatusUpdate {
  status: "new" | "called" | "quoted" | "won" | "lost";
}

export interface EmergencyDispatchCreate {
  contact_name: string;
  phone: string;
  facility_name?: string;
  location_area: string;
  address_details?: string;
  equipment_type: string;
  urgency_level: string;
  problem_description: string;
}

export interface EmergencyDispatch {
  id: string;
  contact_name: string;
  phone: string;
  facility_name?: string;
  location_area: string;
  address_details?: string;
  equipment_type: string;
  urgency_level: string;
  problem_description: string;
  status: string;
  assigned_technician: string;
  eta_minutes: number;
  created_at: string;
}

export interface TestReading {
  parameter: string;
  value: string;
  standard_spec: string;
  status: string;
}

export interface JobStep {
  step_number: number;
  title: string;
  description: string;
  completed: boolean;
  completed_at?: string | null;
}

export interface JobTracker {
  id: string;
  job_id: string;
  customer_name: string;
  company_name?: string;
  phone: string;
  equipment_name: string;
  equipment_specs: string;
  service_type: string;
  intake_date: string;
  estimated_delivery: string;
  current_stage: string;
  status_percentage: number;
  steps: JobStep[];
  test_readings: TestReading[];
  technician_notes?: string;
  wire_type: string;
  warranty_months: number;
  created_at: string;
  updated_at: string;
}

export interface ReviewCreate {
  author_name: string;
  company_or_location: string;
  rating: number;
  equipment_serviced: string;
  review_text: string;
  verified_customer?: boolean;
  photo_url?: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  author_name: string;
  company_or_location: string;
  rating: number;
  equipment_serviced: string;
  review_text: string;
  verified_customer: boolean;
  photo_url?: string | null;
  featured: boolean;
  created_at: string;
}

export interface ReviewFeatureUpdate {
  featured: boolean;
}

export interface MonthlySales {
  month: string;
  quotes: number;
  won: number;
  won_value: number;
  quoted_value: number;
}

export type QuotationStatus = "draft" | "sent" | "approved" | "ordered" | "invoiced";
export type WorkItemStatus = "pending" | "in_progress" | "completed";

export interface QuoteOption {
  id: string;
  product_name: string;
  brand?: string;
  model?: string;
  specifications?: string;
  quantity: number;
  unit_price: number;
  tax_percent: number;
  discount_percent: number;
  supplier?: string;
  warranty?: string;
  delivery_time?: string;
  remarks?: string;
}

export interface WorkItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  material_cost: number;
  labour_cost: number;
  discount_percent: number;
  tax_percent: number;
  status: WorkItemStatus;
  remarks?: string;
}

export interface QuotationCreate {
  customer_name: string;
  customer_phone: string;
  customer_location?: string;
  requirement: string;
  lead_id?: string;
}

export interface QuotationUpdate {
  customer_name?: string;
  customer_phone?: string;
  customer_location?: string;
  requirement?: string;
  status?: QuotationStatus;
  selected_option_id?: string;
  options?: QuoteOption[];
  work_items?: WorkItem[];
  notes?: string;
}

export interface Quotation {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_location?: string;
  requirement: string;
  lead_id?: string | null;
  status: QuotationStatus;
  selected_option_id?: string | null;
  options: QuoteOption[];
  work_items: WorkItem[];
  notes?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface WorkshopStats {
  years_experience: number;
  established_year: number;
  total_motors_rewound: number;
  active_amc_clients: number;
  avg_emergency_response_mins: number;
  satisfied_clients: number;
  licensed_contractor_class: string;
  wireman_license: string;
  gumasta_license: string;
  gstin: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface AuthStatus {
  authenticated: boolean;
  role: string;
}

export interface GalleryItem {
  label: string;
  image_url: string;
}

export interface SiteMedia {
  before_image_url: string;
  after_image_url: string;
  before_caption: string;
  after_caption: string;
  gallery: GalleryItem[];
}

export interface StageAdvanceResult {
  job: JobTracker;
  message: string;
}
