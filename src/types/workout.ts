export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "6-8", "12-15"
  category: 'compound' | 'isolation' | 'cardio' | 'abs';
  muscleGroups: string[];
  subExercises?: {
    name: string;
    sets: number;
    reps: string;
  }[];
}

export interface WorkoutSet {
  id: string;
  exercise_id: string;
  weight: number;
  reps: number;
  completed: boolean;
  rest_time?: number;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  workout_day: string;
  date: string;
  completed: boolean;
  duration_minutes?: number;
  notes?: string;
  created_at: string;
}

export interface ExerciseRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  workout_session_id: string;
  sets: WorkoutSet[];
  personal_record?: number;
  created_at: string;
}

export interface WorkoutDay {
  day: string;
  title: string;
  color: string;
  goal: string;
  exercises: Exercise[];
  finisher: string;
}

export interface ProgressData {
  exercise_id: string;
  date: string;
  max_weight: number;
  total_volume: number;
  one_rep_max: number;
}