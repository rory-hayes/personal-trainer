import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Database features will not work.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          category: 'compound' | 'isolation' | 'cardio' | 'abs';
          muscle_groups: string[];
          equipment: string | null;
          instructions: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      workout_sessions: {
        Row: {
          id: string;
          user_id: string;
          workout_day: string;
          workout_title: string;
          workout_color: string;
          date: string;
          start_time: string | null;
          end_time: string | null;
          duration_minutes: number | null;
          completed: boolean;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          workout_day: string;
          workout_title: string;
          workout_color?: string;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number | null;
          completed?: boolean;
          notes?: string | null;
        };
        Update: {
          workout_day?: string;
          workout_title?: string;
          workout_color?: string;
          date?: string;
          start_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number | null;
          completed?: boolean;
          notes?: string | null;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_session_id: string;
          exercise_id: string;
          exercise_order: number;
          planned_sets: number;
          planned_reps: string;
          completed: boolean;
          created_at: string;
        };
        Insert: {
          workout_session_id: string;
          exercise_id: string;
          exercise_order: number;
          planned_sets: number;
          planned_reps: string;
          completed?: boolean;
        };
        Update: {
          exercise_order?: number;
          planned_sets?: number;
          planned_reps?: string;
          completed?: boolean;
        };
      };
      exercise_sets: {
        Row: {
          id: string;
          workout_exercise_id: string;
          set_number: number;
          weight_kg: number;
          reps: number;
          duration_seconds: number | null;
          rest_time_seconds: number | null;
          completed: boolean;
          rpe: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          workout_exercise_id: string;
          set_number: number;
          weight_kg?: number;
          reps?: number;
          duration_seconds?: number | null;
          rest_time_seconds?: number | null;
          completed?: boolean;
          rpe?: number | null;
          notes?: string | null;
        };
        Update: {
          set_number?: number;
          weight_kg?: number;
          reps?: number;
          duration_seconds?: number | null;
          rest_time_seconds?: number | null;
          completed?: boolean;
          rpe?: number | null;
          notes?: string | null;
        };
      };
      personal_records: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          weight_kg: number;
          reps: number;
          one_rep_max: number | null;
          date_achieved: string;
          workout_session_id: string | null;
          created_at: string;
        };
      };
    };
  };
}