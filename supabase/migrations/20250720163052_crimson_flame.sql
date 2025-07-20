/*
  # Exercise Library Data
  
  Insert all exercises from the workout program into the exercises table.
  This creates the master exercise library that users can reference.
*/

-- Insert all exercises from the workout program
INSERT INTO exercises (name, category, muscle_groups, equipment, instructions) VALUES

-- Monday - Push (Chest, Shoulders, Triceps)
('Barbell Bench Press', 'compound', ARRAY['chest', 'triceps', 'shoulders'], 'barbell', 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up explosively'),
('Dumbbell Incline Press', 'compound', ARRAY['chest', 'shoulders', 'triceps'], 'dumbbells', 'Set bench to 30-45 degrees, press dumbbells from chest level to overhead'),
('Dumbbell Lateral Raises', 'isolation', ARRAY['shoulders'], 'dumbbells', 'Stand with dumbbells at sides, raise arms out to shoulder height, control the descent'),
('Machine Chest Press', 'compound', ARRAY['chest', 'triceps'], 'machine', 'Sit upright, grip handles at chest level, press forward with controlled motion'),
('Overhead Dumbbell Tricep Extension', 'isolation', ARRAY['triceps'], 'dumbbells', 'Hold dumbbell overhead with both hands, lower behind head, extend back to start'),
('Cable Tricep Pushdowns', 'isolation', ARRAY['triceps'], 'cable machine', 'Stand at cable machine, push rope/bar down while keeping elbows at sides'),

-- Tuesday - Pull (Back & Biceps)
('Barbell Bent-Over Rows', 'compound', ARRAY['back', 'biceps'], 'barbell', 'Hinge at hips, pull bar to lower chest/upper abdomen, squeeze shoulder blades'),
('Seated Cable Row', 'compound', ARRAY['back', 'biceps'], 'cable machine', 'Sit upright, pull handle to lower chest, focus on squeezing shoulder blades'),
('Lat Pulldown (Wide Grip)', 'compound', ARRAY['back', 'biceps'], 'cable machine', 'Sit at lat pulldown, pull bar to upper chest with wide overhand grip'),
('Rear Delt Dumbbell Flyes', 'isolation', ARRAY['shoulders', 'back'], 'dumbbells', 'Bend forward, raise dumbbells out to sides, focus on rear deltoids'),
('Barbell/EZ Bar Bicep Curls', 'isolation', ARRAY['biceps'], 'barbell', 'Stand with bar, curl up while keeping elbows stationary, control the descent'),
('Incline Dumbbell Curls', 'isolation', ARRAY['biceps'], 'dumbbells', 'Sit on incline bench, curl dumbbells with full range of motion'),

-- Wednesday - Legs (Strength Focus)
('Barbell Back Squats', 'compound', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'barbell', 'Bar on upper back, squat down until thighs parallel, drive through heels'),
('Romanian Deadlifts', 'compound', ARRAY['hamstrings', 'glutes', 'back'], 'barbell', 'Hinge at hips, lower bar along legs, feel stretch in hamstrings, return to standing'),
('Bulgarian Split Squats', 'compound', ARRAY['quadriceps', 'glutes'], 'dumbbells', 'Rear foot elevated, lunge down on front leg, drive through front heel'),
('Leg Extensions', 'isolation', ARRAY['quadriceps'], 'machine', 'Sit on machine, extend legs against resistance, control the descent'),
('Standing Calf Raises', 'isolation', ARRAY['calves'], 'machine', 'Stand on platform, raise up on toes, hold briefly, lower with control'),
('Seated Calf Raises', 'isolation', ARRAY['calves'], 'machine', 'Sit with weight on thighs, raise up on toes, focus on calf contraction'),

-- Thursday - Push (Overhead Focus)
('Barbell Overhead Press', 'compound', ARRAY['shoulders', 'triceps', 'core'], 'barbell', 'Stand with bar at shoulder level, press overhead, keep core tight'),
('Dumbbell Arnold Press', 'compound', ARRAY['shoulders', 'triceps'], 'dumbbells', 'Start with palms facing you, rotate and press overhead, reverse on descent'),
('Dumbbell Chest Press', 'compound', ARRAY['chest', 'triceps', 'shoulders'], 'dumbbells', 'Lie on bench, press dumbbells from chest level to overhead'),
('Cable Lateral Raises', 'isolation', ARRAY['shoulders'], 'cable machine', 'Stand sideways to cable, raise arm out to shoulder height'),
('Overhead Cable Tricep Extensions', 'isolation', ARRAY['triceps'], 'cable machine', 'Face away from cable, extend arms overhead, lower behind head'),
('Machine Dips', 'compound', ARRAY['triceps', 'chest'], 'machine', 'Sit upright, press down on handles, focus on tricep contraction'),
('Bench Dips', 'compound', ARRAY['triceps', 'chest'], 'bench', 'Hands on bench behind you, lower body down, press back up'),

-- Friday - Pull (Vertical Pull / Arms Focus)
('Weighted Pull-Ups', 'compound', ARRAY['back', 'biceps'], 'pull-up bar', 'Hang from bar with added weight, pull up until chin over bar'),
('Lat Pulldown (Neutral Grip)', 'compound', ARRAY['back', 'biceps'], 'cable machine', 'Sit at lat pulldown, pull with neutral grip handles to upper chest'),
('Chest-Supported Row', 'compound', ARRAY['back', 'biceps'], 'machine', 'Chest against pad, pull handles to sides, squeeze shoulder blades'),
('Dumbbell Row', 'compound', ARRAY['back', 'biceps'], 'dumbbells', 'One knee on bench, row dumbbell to hip, squeeze at top'),
('Cable Face Pulls', 'isolation', ARRAY['shoulders', 'back'], 'cable machine', 'Pull rope to face level, separate handles, focus on rear delts'),
('Hammer Curls', 'isolation', ARRAY['biceps', 'forearms'], 'dumbbells', 'Hold dumbbells with neutral grip, curl up, control descent'),
('Preacher Curls', 'isolation', ARRAY['biceps'], 'preacher bench', 'Arms on preacher pad, curl weight up, control the negative'),
('Machine Curls', 'isolation', ARRAY['biceps'], 'machine', 'Sit at machine, curl handles up while keeping elbows stable'),

-- Saturday - Legs (Volume, Hamstrings/Glutes)
('Leg Press', 'compound', ARRAY['quadriceps', 'glutes'], 'machine', 'Sit in leg press, lower weight to 90 degrees, press through heels'),
('Dumbbell Walking Lunges', 'compound', ARRAY['quadriceps', 'glutes', 'hamstrings'], 'dumbbells', 'Step forward into lunge, alternate legs while walking'),
('Hip Thrusts', 'isolation', ARRAY['glutes', 'hamstrings'], 'barbell', 'Upper back on bench, thrust hips up, squeeze glutes at top'),
('Glute Bridges', 'isolation', ARRAY['glutes', 'hamstrings'], 'bodyweight', 'Lie on back, thrust hips up, squeeze glutes, hold briefly'),
('Seated Leg Curl Machine', 'isolation', ARRAY['hamstrings'], 'machine', 'Sit on machine, curl heels toward glutes, control the return'),

-- Abs exercises (added to all days)
('Lying Leg Raises', 'abs', ARRAY['abs'], 'bodyweight', 'Lie on back, raise straight legs to 90 degrees, lower with control'),
('Reverse Crunches', 'abs', ARRAY['abs'], 'bodyweight', 'Lie on back, bring knees to chest, lift hips slightly off ground'),
('Plank Hold', 'abs', ARRAY['abs', 'core'], 'bodyweight', 'Hold plank position, keep body straight, engage core throughout'),
('Toe Touches', 'abs', ARRAY['abs'], 'bodyweight', 'Lie on back, reach hands toward toes, crunch up'),
('Bicycle Crunches', 'abs', ARRAY['abs'], 'bodyweight', 'Lie on back, alternate bringing elbow to opposite knee'),
('Hanging Leg Raises', 'abs', ARRAY['abs'], 'pull-up bar', 'Hang from bar, raise knees to chest, control the descent')

ON CONFLICT (name) DO NOTHING;