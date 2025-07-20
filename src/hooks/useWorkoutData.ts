import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row'];
type WorkoutExercise = Database['public']['Tables']['workout_exercises']['Row'];
type ExerciseSet = Database['public']['Tables']['exercise_sets']['Row'];
type Exercise = Database['public']['Tables']['exercises']['Row'];
type PersonalRecord = Database['public']['Tables']['personal_records']['Row'];

export interface WorkoutWithExercises extends WorkoutSession {
  exercises: (WorkoutExercise & {
    exercise: Exercise;
    sets: ExerciseSet[];
  })[];
}

export function useWorkoutData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create a new workout session
  const createWorkoutSession = async (workoutData: {
    workout_day: string;
    workout_title: string;
    workout_color: string;
    exercises: Array<{
      exercise_name: string;
      planned_sets: number;
      planned_reps: string;
      exercise_order: number;
    }>;
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        console.warn('Supabase not configured. Workout will only be tracked locally.');
        return { id: `local-${Date.now()}`, user_id: 'local-user', ...workoutData };
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Create workout session
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_day: workoutData.workout_day,
          workout_title: workoutData.workout_title,
          workout_color: workoutData.workout_color,
          start_time: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Add exercises to the workout
      for (const exerciseData of workoutData.exercises) {
        // Get exercise ID by name
        const { data: exercise, error: exerciseError } = await supabase
          .from('exercises')
          .select('id')
          .eq('name', exerciseData.exercise_name)
          .single();

        if (exerciseError) throw exerciseError;

        // Insert workout exercise
        const { error: workoutExerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_session_id: session.id,
            exercise_id: exercise.id,
            exercise_order: exerciseData.exercise_order,
            planned_sets: exerciseData.planned_sets,
            planned_reps: exerciseData.planned_reps,
          });

        if (workoutExerciseError) throw workoutExerciseError;
      }

      return session;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Save a completed set
  const saveExerciseSet = async (setData: {
    workout_exercise_id: string;
    set_number: number;
    weight_kg: number;
    reps: number;
    completed: boolean;
    rest_time_seconds?: number;
  }) => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        console.warn('Supabase not configured. Set data will only be tracked locally.');
        return { id: `local-set-${Date.now()}`, ...setData };
      }

      const { data, error } = await supabase
        .from('exercise_sets')
        .upsert({
          workout_exercise_id: setData.workout_exercise_id,
          set_number: setData.set_number,
          weight_kg: setData.weight_kg,
          reps: setData.reps,
          completed: setData.completed,
          rest_time_seconds: setData.rest_time_seconds,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Complete a workout session
  const completeWorkoutSession = async (sessionId: string, duration_minutes: number) => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        console.warn('Supabase not configured. Workout completion will only be tracked locally.');
        return { id: sessionId, completed: true, duration_minutes };
      }

      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          completed: true,
          end_time: new Date().toISOString(),
          duration_minutes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get workout history
  const getWorkoutHistory = async (limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          workout_exercises (
            *,
            exercise:exercises (*),
            exercise_sets (*)
          )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as WorkoutWithExercises[];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get exercise progress data
  const getExerciseProgress = async (exerciseName: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('exercise_sets')
        .select(`
          weight_kg,
          reps,
          created_at,
          workout_exercises!inner (
            workout_sessions!inner (
              user_id,
              date
            ),
            exercises!inner (
              name
            )
          )
        `)
        .eq('workout_exercises.workout_sessions.user_id', user.id)
        .eq('workout_exercises.exercises.name', exerciseName)
        .eq('completed', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get personal records
  const getPersonalRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('personal_records')
        .select(`
          *,
          exercises (name, category)
        `)
        .eq('user_id', user.id)
        .order('one_rep_max', { ascending: false });

      if (error) throw error;
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get workout exercise ID by session and exercise name
  const getWorkoutExerciseId = async (workoutSessionId: string, exerciseName: string) => {
    try {
      if (!supabase) {
        console.warn('Supabase not configured. Using local workout exercise ID.');
        return `local-exercise-${workoutSessionId}-${exerciseName}`;
      }

      const { data, error } = await supabase
        .from('workout_exercises')
        .select(`
          id,
          exercises!inner (name)
        `)
        .eq('workout_session_id', workoutSessionId)
        .eq('exercises.name', exerciseName)
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    loading,
    error,
    createWorkoutSession,
    saveExerciseSet,
    completeWorkoutSession,
    getWorkoutHistory,
    getExerciseProgress,
    getPersonalRecords,
    getWorkoutExerciseId,
  };
}