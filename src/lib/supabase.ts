import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      physical_therapists: {
        Row: {
          id: string;
          name: string;
          license_number: string;
          position: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          license_number: string;
          position: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          license_number?: string;
          position?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          patient_name: string;
          patient_id: string;
          date_of_birth: string;
          sex: string;
          address: string | null;
          primary_insurance: string | null;
          secondary_insurance: string | null;
          referring_provider: string | null;
          diagnosis: string | null;
          precautions: string | null;
          comorbidities: string | null;
          date_of_injury: string | null;
          surgical_history: string | null;
          imaging_results: string | null;
          medications: string | null;
          selected_body_areas: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_name: string;
          patient_id: string;
          date_of_birth: string;
          sex: string;
          address?: string | null;
          primary_insurance?: string | null;
          secondary_insurance?: string | null;
          referring_provider?: string | null;
          diagnosis?: string | null;
          precautions?: string | null;
          comorbidities?: string | null;
          date_of_injury?: string | null;
          surgical_history?: string | null;
          imaging_results?: string | null;
          medications?: string | null;
          selected_body_areas?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_name?: string;
          patient_id?: string;
          date_of_birth?: string;
          sex?: string;
          address?: string | null;
          primary_insurance?: string | null;
          secondary_insurance?: string | null;
          referring_provider?: string | null;
          diagnosis?: string | null;
          precautions?: string | null;
          comorbidities?: string | null;
          date_of_injury?: string | null;
          surgical_history?: string | null;
          imaging_results?: string | null;
          medications?: string | null;
          selected_body_areas?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clinical_records: {
        Row: {
          id: string;
          patient_id: string;
          therapist_id: string;
          form_type: 'PT Notes' | 'Initial Evaluation' | 'Discharge Summary';
          record_date: string;
          form_data: any;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          therapist_id: string;
          form_type: 'PT Notes' | 'Initial Evaluation' | 'Discharge Summary';
          record_date: string;
          form_data: any;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          therapist_id?: string;
          form_type?: 'PT Notes' | 'Initial Evaluation' | 'Discharge Summary';
          record_date?: string;
          form_data?: any;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
