import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Main Projects Table
export type Project = {
  id: string;
  sn: number;
  nesdmp_pillars: string[];
  sector: string;
  project_description: string;
  state: string;
  lga: string;
  community: string;
  project_status_q1: string;
  remarks_q1?: string;
  project_status_q2?: string;
  remarks_q2?: string;
  project_status_q3?: string;
  remarks_q3?: string;
  project_status_q4?: string;
  remarks_q4?: string;
  contract_amount?: number;
  amount_disbursed_first?: number;
  amount_disbursed_second?: number;
  amount_disbursed_third?: number;
  retention?: number;
  total_amount_disbursed?: number;
  date_of_award?: string;
  date_of_completion?: string;
  contractor?: string;
  created_at?: string;
  updated_at?: string;
};

// Operations Directorate
export type OperationsProject = {
  id: string;
  sn: number;
  nesdmp_pillars: string[];
  sector: string;
  project_id_no: string;
  program_description: string;
  project_under_program: string;
  project_boq?: string;
  state: string;
  lga: string;
  planned_milestone: string;
  targeted_milestone: string;
  source_of_funding: string;
  beneficiaries: number;
  actual_achievement?: string;
  project_status: string;
  challenges?: string;
  cost?: number;
  expenditure?: number;
  dates?: string;
  satisfaction?: string;
  gps?: string;
  photos?: string[];
  remarks?: string;
  created_at?: string;
  updated_at?: string;
};

// Humanitarian Directorate - Food/Non-food Items
export type HumanitarianItem = {
  id: string;
  sn: number;
  nesdmp_pillar: string;
  sector: string;
  project_id_no: string;
  item_description: string;
  item_type: string;
  state: string;
  lga: string;
  date_of_award?: string;
  status: string;
  funding_source: string;
  quantity_in_store: number;
  disbursed: number;
  wasted: number;
  distribution_date?: string;
  total_hh: number;
  beneficiary_hh_male: number;
  beneficiary_hh_female: number;
  community: string;
  distributed_quantity: number;
  agencies?: string;
  gps?: string;
  photos?: string[];
  remarks?: string;
  created_at?: string;
  updated_at?: string;
};

// Other Humanitarian Interventions
export type HumanitarianIntervention = {
  id: string;
  sn: number;
  project_id_no: string;
  project_program: string;
  objectives: string;
  state: string;
  lga: string;
  status: string;
  targeted_output: string;
  actual_output?: string;
  start_date?: string;
  end_date?: string;
  crisis_impact?: string;
  funding_source: string;
  gps?: string;
  photos?: string[];
  remarks?: string;
  created_at?: string;
  updated_at?: string;
};

// Challenges and Recommendations
export type Challenge = {
  id: string;
  sn: number;
  key_challenges: string;
  bottleneck_category: string;
  impact_severity: number;
  recommendations: string;
  created_at?: string;
  updated_at?: string;
};

// Gallery Images
export type GalleryImage = {
  id: string;
  title: string;
  description?: string;
  image_url: string;
  year: number;
  state?: string;
  pillar?: string;
  sector?: string;
  project_id?: string;
  created_at?: string;
};

// Calendar Events
export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  event_time?: string;
  location?: string;
  event_type: 'monitoring' | 'evaluation' | 'training' | 'meeting' | 'field_visit';
  participants?: string[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
};

// User Profiles
export type UserProfile = {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  full_name?: string;
  department?: string;
  last_login?: string;
  is_active: boolean;
  created_at?: string;
  created_by?: string;
};

// Audit Logs
export type AuditLog = {
  id: string;
  user_id: string;
  action: string;
  table_name: string;
  record_id?: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  created_at?: string;
};