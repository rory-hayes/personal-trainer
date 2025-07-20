/*
  # Complete Workout Tracker Database Schema

  This schema supports a comprehensive workout tracking system with:
  1. User profiles and authentication
  2. Exercise library with metadata
  3. Workout sessions and completion tracking
  4. Individual sets with reps, weights, and timing
  5. Progress tracking and historical data
  6. Row Level Security for multi-user support

  ## Tables Overview:
  - `profiles`: User profile information
  - `exercises`: Master exercise library
  - `workout_sessions`: Individual workout sessions
  - `workout_exercises`: Exercises planned for a specific workout
  - `exercise_sets`: Individual sets with reps, weight, and completion status
  - `personal_records`: Track personal bests for each exercise
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles Table
-- Extends Supabase auth.users with additional profile information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Exercise Library Table
-- Master table containing all available exercises
CREATE TABLE IF NOT EXISTS exercises (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('compound', 'isolation', 'cardio', 'abs')),
  muscle_groups text[] NOT NULL,
  equipment text,
  instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure unique exercise names
  UNIQUE(name)
);

-- 3. Workout Sessions Table
-- Tracks individual workout sessions
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  workout_day text NOT NULL, -- 'Monday', 'Tuesday', etc.
  workout_title text NOT NULL, -- 'Push (Chest, Shoulders, Triceps)'
  workout_color text NOT NULL DEFAULT 'bg-blue-500',
  date date NOT NULL DEFAULT CURRENT_DATE,
  start_time timestamptz,
  end_time timestamptz,
  duration_minutes integer,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure one workout per day per user
  UNIQUE(user_id, date, workout_day)
);

-- 4. Workout Exercises Table
-- Links exercises to specific workout sessions with planned sets/reps
CREATE TABLE IF NOT EXISTS workout_exercises (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_session_id uuid NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  exercise_order integer NOT NULL, -- Order within the workout
  planned_sets integer NOT NULL,
  planned_reps text NOT NULL, -- e.g., "6-8", "12-15", "1 minute"
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique exercise order within workout
  UNIQUE(workout_session_id, exercise_order)
);

-- 5. Exercise Sets Table
-- Individual sets with actual performance data
CREATE TABLE IF NOT EXISTS exercise_sets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_exercise_id uuid NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,
  set_number integer NOT NULL,
  weight_kg numeric(5,2) DEFAULT 0, -- Supports up to 999.99 kg
  reps integer DEFAULT 0,
  duration_seconds integer, -- For time-based exercises like planks
  rest_time_seconds integer,
  completed boolean DEFAULT false,
  rpe integer CHECK (rpe >= 1 AND rpe <= 10), -- Rate of Perceived Exertion
  notes text,
  created_at timestamptz DEFAULT now(),
  
  -- Ensure unique set numbers within exercise
  UNIQUE(workout_exercise_id, set_number)
);

-- 6. Personal Records Table
-- Track personal bests for each exercise
CREATE TABLE IF NOT EXISTS personal_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  weight_kg numeric(5,2) NOT NULL,
  reps integer NOT NULL,
  one_rep_max numeric(5,2), -- Calculated 1RM using Epley formula
  date_achieved date NOT NULL DEFAULT CURRENT_DATE,
  workout_session_id uuid REFERENCES workout_sessions(id),
  created_at timestamptz DEFAULT now(),
  
  -- One PR per exercise per user (updated when beaten)
  UNIQUE(user_id, exercise_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_date ON workout_sessions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_session ON workout_exercises(workout_session_id, exercise_order);
CREATE INDEX IF NOT EXISTS idx_exercise_sets_workout_exercise ON exercise_sets(workout_exercise_id, set_number);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise ON personal_records(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_groups ON exercises USING GIN(muscle_groups);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for workout_sessions
CREATE POLICY "Users can manage own workout sessions"
  ON workout_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for workout_exercises
CREATE POLICY "Users can manage own workout exercises"
  ON workout_exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = workout_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_sessions 
      WHERE workout_sessions.id = workout_exercises.workout_session_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for exercise_sets
CREATE POLICY "Users can manage own exercise sets"
  ON exercise_sets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises 
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_session_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises 
      JOIN workout_sessions ON workout_sessions.id = workout_exercises.workout_session_id
      WHERE workout_exercises.id = exercise_sets.workout_exercise_id 
      AND workout_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for personal_records
CREATE POLICY "Users can manage own personal records"
  ON personal_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Exercises table is public (read-only for authenticated users)
CREATE POLICY "Authenticated users can read exercises"
  ON exercises
  FOR SELECT
  TO authenticated
  USING (true);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at 
  BEFORE UPDATE ON exercises 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workout_sessions_updated_at 
  BEFORE UPDATE ON workout_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate and update one-rep max
CREATE OR REPLACE FUNCTION calculate_one_rep_max(weight_kg numeric, reps integer)
RETURNS numeric AS $$
BEGIN
  -- Epley formula: 1RM = weight × (1 + reps/30)
  RETURN ROUND(weight_kg * (1 + reps::numeric / 30), 2);
END;
$$ LANGUAGE plpgsql;

-- Function to update personal records automatically
CREATE OR REPLACE FUNCTION update_personal_record()
RETURNS TRIGGER AS $$
DECLARE
  current_pr numeric;
  new_one_rep_max numeric;
  session_user_id uuid;
  session_exercise_id uuid;
BEGIN
  -- Get user_id and exercise_id from the workout structure
  SELECT ws.user_id, we.exercise_id INTO session_user_id, session_exercise_id
  FROM workout_exercises we
  JOIN workout_sessions ws ON ws.id = we.workout_session_id
  WHERE we.id = NEW.workout_exercise_id;
  
  -- Calculate new one-rep max
  new_one_rep_max := calculate_one_rep_max(NEW.weight_kg, NEW.reps);
  
  -- Check if this beats the current PR
  SELECT one_rep_max INTO current_pr
  FROM personal_records
  WHERE user_id = session_user_id AND exercise_id = session_exercise_id;
  
  -- Insert or update personal record if this is better
  IF current_pr IS NULL OR new_one_rep_max > current_pr THEN
    INSERT INTO personal_records (user_id, exercise_id, weight_kg, reps, one_rep_max, workout_session_id)
    VALUES (session_user_id, session_exercise_id, NEW.weight_kg, NEW.reps, new_one_rep_max, 
            (SELECT workout_session_id FROM workout_exercises WHERE id = NEW.workout_exercise_id))
    ON CONFLICT (user_id, exercise_id)
    DO UPDATE SET
      weight_kg = NEW.weight_kg,
      reps = NEW.reps,
      one_rep_max = new_one_rep_max,
      date_achieved = CURRENT_DATE,
      workout_session_id = (SELECT workout_session_id FROM workout_exercises WHERE id = NEW.workout_exercise_id);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update personal records when sets are completed
CREATE TRIGGER update_pr_on_set_completion
  AFTER INSERT OR UPDATE ON exercise_sets
  FOR EACH ROW
  WHEN (NEW.completed = true AND NEW.weight_kg > 0 AND NEW.reps > 0)
  EXECUTE FUNCTION update_personal_record();