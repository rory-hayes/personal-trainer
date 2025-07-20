/*
  # Sample Workout Data
  
  This file demonstrates how to insert a complete workout session with exercises and sets.
  Replace the user_id with an actual authenticated user ID from your application.
*/

-- Example: Insert a sample user profile (this would normally be created via Supabase Auth)
-- Note: In production, this would be handled by your authentication flow
DO $$
DECLARE
  sample_user_id uuid := '550e8400-e29b-41d4-a716-446655440000'; -- Replace with actual user ID
  sample_session_id uuid;
  sample_exercise_id uuid;
  bench_press_id uuid;
  incline_press_id uuid;
  lateral_raises_id uuid;
  lying_leg_raises_id uuid;
BEGIN
  -- Insert sample profile (only if it doesn't exist)
  INSERT INTO profiles (id, email, full_name)
  VALUES (sample_user_id, 'demo@example.com', 'Demo User')
  ON CONFLICT (id) DO NOTHING;

  -- Get exercise IDs
  SELECT id INTO bench_press_id FROM exercises WHERE name = 'Barbell Bench Press';
  SELECT id INTO incline_press_id FROM exercises WHERE name = 'Dumbbell Incline Press';
  SELECT id INTO lateral_raises_id FROM exercises WHERE name = 'Dumbbell Lateral Raises';
  SELECT id INTO lying_leg_raises_id FROM exercises WHERE name = 'Lying Leg Raises';

  -- 1. Create a workout session (Monday Push Day)
  INSERT INTO workout_sessions (
    id, user_id, workout_day, workout_title, workout_color, date, start_time, completed
  ) VALUES (
    uuid_generate_v4(), sample_user_id, 'Monday', 'Push (Chest, Shoulders, Triceps)', 
    'bg-green-500', CURRENT_DATE, now(), false
  ) RETURNING id INTO sample_session_id;

  -- 2. Add exercises to the workout
  INSERT INTO workout_exercises (workout_session_id, exercise_id, exercise_order, planned_sets, planned_reps) VALUES
  (sample_session_id, bench_press_id, 1, 4, '6-8'),
  (sample_session_id, incline_press_id, 2, 4, '8-10'),
  (sample_session_id, lateral_raises_id, 3, 4, '12-15'),
  (sample_session_id, lying_leg_raises_id, 4, 3, '15');

  -- 3. Record some completed sets for Barbell Bench Press
  INSERT INTO exercise_sets (workout_exercise_id, set_number, weight_kg, reps, completed, rest_time_seconds) VALUES
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 1), 1, 80.0, 8, true, 180),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 1), 2, 80.0, 7, true, 180),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 1), 3, 80.0, 6, true, 180),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 1), 4, 80.0, 6, true, 180);

  -- 4. Record sets for Dumbbell Incline Press
  INSERT INTO exercise_sets (workout_exercise_id, set_number, weight_kg, reps, completed, rest_time_seconds) VALUES
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 2), 1, 30.0, 10, true, 120),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 2), 2, 30.0, 9, true, 120),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 2), 3, 30.0, 8, true, 120),
  ((SELECT id FROM workout_exercises WHERE workout_session_id = sample_session_id AND exercise_order = 2), 4, 30.0, 8, true, 120);

  RAISE NOTICE 'Sample workout data inserted successfully for session: %', sample_session_id;
END $$;

-- Example queries to retrieve workout data

-- Get all workout sessions for a user
/*
SELECT 
  ws.id,
  ws.workout_day,
  ws.workout_title,
  ws.date,
  ws.completed,
  ws.duration_minutes,
  COUNT(we.id) as total_exercises,
  COUNT(CASE WHEN we.completed THEN 1 END) as completed_exercises
FROM workout_sessions ws
LEFT JOIN workout_exercises we ON ws.id = we.workout_session_id
WHERE ws.user_id = '550e8400-e29b-41d4-a716-446655440000'
GROUP BY ws.id, ws.workout_day, ws.workout_title, ws.date, ws.completed, ws.duration_minutes
ORDER BY ws.date DESC;
*/

-- Get detailed workout with exercises and sets
/*
SELECT 
  ws.workout_day,
  ws.workout_title,
  e.name as exercise_name,
  we.planned_sets,
  we.planned_reps,
  es.set_number,
  es.weight_kg,
  es.reps,
  es.completed as set_completed
FROM workout_sessions ws
JOIN workout_exercises we ON ws.id = we.workout_session_id
JOIN exercises e ON we.exercise_id = e.id
LEFT JOIN exercise_sets es ON we.id = es.workout_exercise_id
WHERE ws.user_id = '550e8400-e29b-41d4-a716-446655440000'
  AND ws.date = CURRENT_DATE
ORDER BY we.exercise_order, es.set_number;
*/

-- Get personal records for a user
/*
SELECT 
  e.name as exercise_name,
  pr.weight_kg,
  pr.reps,
  pr.one_rep_max,
  pr.date_achieved
FROM personal_records pr
JOIN exercises e ON pr.exercise_id = e.id
WHERE pr.user_id = '550e8400-e29b-41d4-a716-446655440000'
ORDER BY pr.one_rep_max DESC;
*/

-- Get progress data for a specific exercise
/*
SELECT 
  ws.date,
  es.weight_kg,
  es.reps,
  calculate_one_rep_max(es.weight_kg, es.reps) as estimated_1rm,
  (es.weight_kg * es.reps) as volume
FROM exercise_sets es
JOIN workout_exercises we ON es.workout_exercise_id = we.id
JOIN workout_sessions ws ON we.workout_session_id = ws.id
JOIN exercises e ON we.exercise_id = e.id
WHERE ws.user_id = '550e8400-e29b-41d4-a716-446655440000'
  AND e.name = 'Barbell Bench Press'
  AND es.completed = true
ORDER BY ws.date DESC, es.set_number;
*/