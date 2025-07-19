import { WorkoutDay } from '../types/workout';

export const workoutProgram: WorkoutDay[] = [
  {
    day: 'Monday',
    title: 'Push (Chest, Shoulders, Triceps)',
    color: 'bg-green-500',
    goal: 'Upper push day focused on strength & hypertrophy',
    finisher: '10-min leg raises + 10–15 min ab circuit',
    exercises: [
      {
        id: 'bb-bench-press',
        name: 'Barbell Bench Press',
        sets: 4,
        reps: '6-8',
        category: 'compound',
        muscleGroups: ['chest', 'triceps', 'shoulders']
      },
      {
        id: 'db-incline-press',
        name: 'Dumbbell Incline Press',
        sets: 4,
        reps: '8-10',
        category: 'compound',
        muscleGroups: ['chest', 'shoulders', 'triceps']
      },
      {
        id: 'db-lateral-raises',
        name: 'Dumbbell Lateral Raises',
        sets: 4,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['shoulders']
      },
      {
        id: 'machine-chest-press',
        name: 'Machine Chest Press',
        sets: 3,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['chest', 'triceps']
      },
      {
        id: 'overhead-tricep-ext',
        name: 'Overhead Dumbbell Tricep Extension',
        sets: 3,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['triceps']
      },
      {
        id: 'cable-tricep-pushdowns',
        name: 'Cable Tricep Pushdowns',
        sets: 3,
        reps: '15-20',
        category: 'isolation',
        muscleGroups: ['triceps']
      },
      {
        id: 'abs-mon',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  },
  {
    day: 'Tuesday',
    title: 'Pull (Back & Biceps)',
    color: 'bg-blue-500',
    goal: 'Horizontal pull + arm hypertrophy',
    finisher: '10-min leg raises + abs + Optional Zone 2 jog',
    exercises: [
      {
        id: 'bb-bent-rows',
        name: 'Barbell Bent-Over Rows',
        sets: 4,
        reps: '6-8',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'seated-cable-row',
        name: 'Seated Cable Row',
        sets: 3,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'lat-pulldown-wide',
        name: 'Lat Pulldown (Wide Grip)',
        sets: 4,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'rear-delt-flyes',
        name: 'Rear Delt Dumbbell Flyes',
        sets: 3,
        reps: '15-20',
        category: 'isolation',
        muscleGroups: ['shoulders', 'back']
      },
      {
        id: 'bb-bicep-curls',
        name: 'Barbell/EZ Bar Bicep Curls',
        sets: 3,
        reps: '10-12',
        category: 'isolation',
        muscleGroups: ['biceps']
      },
      {
        id: 'incline-db-curls',
        name: 'Incline Dumbbell Curls',
        sets: 3,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['biceps']
      },
      {
        id: 'abs-tue',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  },
  {
    day: 'Wednesday',
    title: 'Legs (Strength Focus)',
    color: 'bg-red-500',
    goal: 'Heavier compound lifts, quad-dominant',
    finisher: '10-min leg raises + abs',
    exercises: [
      {
        id: 'bb-back-squats',
        name: 'Barbell Back Squats',
        sets: 4,
        reps: '6-8',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings']
      },
      {
        id: 'romanian-deadlifts',
        name: 'Romanian Deadlifts',
        sets: 4,
        reps: '8-10',
        category: 'compound',
        muscleGroups: ['hamstrings', 'glutes', 'back']
      },
      {
        id: 'bulgarian-split-squats',
        name: 'Bulgarian Split Squats',
        sets: 3,
        reps: '10 each leg',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes']
      },
      {
        id: 'leg-extensions',
        name: 'Leg Extensions',
        sets: 3,
        reps: '15',
        category: 'isolation',
        muscleGroups: ['quadriceps']
      },
      {
        id: 'standing-calf-raises',
        name: 'Standing Calf Raises',
        sets: 4,
        reps: '15-20',
        category: 'isolation',
        muscleGroups: ['calves']
      },
      {
        id: 'seated-calf-raises',
        name: 'Seated Calf Raises',
        sets: 4,
        reps: '15-20',
        category: 'isolation',
        muscleGroups: ['calves']
      },
      {
        id: 'abs-wed',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  },
  {
    day: 'Thursday',
    title: 'Push (Overhead Focus)',
    color: 'bg-yellow-500',
    goal: 'Shoulder & upper chest hypertrophy',
    finisher: '10-min leg raises + abs',
    exercises: [
      {
        id: 'bb-overhead-press',
        name: 'Barbell Overhead Press',
        sets: 4,
        reps: '6-8',
        category: 'compound',
        muscleGroups: ['shoulders', 'triceps', 'core']
      },
      {
        id: 'db-arnold-press',
        name: 'Dumbbell Arnold Press',
        sets: 4,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['shoulders', 'triceps']
      },
      {
        id: 'db-chest-press',
        name: 'Dumbbell Chest Press',
        sets: 3,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['chest', 'triceps', 'shoulders']
      },
      {
        id: 'cable-lateral-raises',
        name: 'Cable Lateral Raises',
        sets: 3,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['shoulders']
      },
      {
        id: 'overhead-cable-tricep',
        name: 'Overhead Cable Tricep Extensions',
        sets: 3,
        reps: '15',
        category: 'isolation',
        muscleGroups: ['triceps']
      },
      {
        id: 'machine-dips',
        name: 'Machine Dips or Bench Dips',
        sets: 3,
        reps: '15-20',
        category: 'compound',
        muscleGroups: ['triceps', 'chest']
      },
      {
        id: 'abs-thu',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  },
  {
    day: 'Friday',
    title: 'Pull (Vertical Pull / Arms Focus)',
    color: 'bg-blue-600',
    goal: 'Lats, biceps, and thickness',
    finisher: '10-min leg raises + abs',
    exercises: [
      {
        id: 'weighted-pullups',
        name: 'Weighted Pull-Ups',
        sets: 4,
        reps: '6-10',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'lat-pulldown-neutral',
        name: 'Lat Pulldown (Neutral Grip)',
        sets: 4,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'chest-supported-row',
        name: 'Chest-Supported Row or Dumbbell Row',
        sets: 4,
        reps: '10',
        category: 'compound',
        muscleGroups: ['back', 'biceps']
      },
      {
        id: 'cable-face-pulls',
        name: 'Cable Face Pulls',
        sets: 3,
        reps: '15-20',
        category: 'isolation',
        muscleGroups: ['shoulders', 'back']
      },
      {
        id: 'hammer-curls',
        name: 'Hammer Curls',
        sets: 3,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['biceps', 'forearms']
      },
      {
        id: 'preacher-curls',
        name: 'Preacher Curls or Machine Curls',
        sets: 3,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['biceps']
      },
      {
        id: 'abs-fri',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  },
  {
    day: 'Saturday',
    title: 'Legs (Volume, Hamstrings/Glutes)',
    color: 'bg-orange-500',
    goal: 'Isolation & higher volume leg hypertrophy',
    finisher: '10-min leg raises + abs + Sprints/Hills',
    exercises: [
      {
        id: 'leg-press',
        name: 'Leg Press',
        sets: 4,
        reps: '10-12',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes']
      },
      {
        id: 'db-walking-lunges',
        name: 'Dumbbell Walking Lunges',
        sets: 3,
        reps: '12 each leg',
        category: 'compound',
        muscleGroups: ['quadriceps', 'glutes', 'hamstrings']
      },
      {
        id: 'hip-thrusts',
        name: 'Hip Thrusts or Glute Bridges',
        sets: 4,
        reps: '12-15',
        category: 'isolation',
        muscleGroups: ['glutes', 'hamstrings']
      },
      {
        id: 'seated-leg-curl',
        name: 'Seated Leg Curl Machine',
        sets: 3,
        reps: '15',
        category: 'isolation',
        muscleGroups: ['hamstrings']
      },
      {
        id: 'standing-calf-raises-sat',
        name: 'Standing Calf Raises',
        sets: 4,
        reps: '20',
        category: 'isolation',
        muscleGroups: ['calves']
      },
      {
        id: 'abs-sat',
        name: 'Abs',
        sets: 1,
        reps: 'See below',
        category: 'abs',
        muscleGroups: ['abs'],
        subExercises: [
          { name: 'Lying Leg Raises', sets: 3, reps: '15' },
          { name: 'Reverse Crunches', sets: 3, reps: '15' },
          { name: 'Plank Hold', sets: 3, reps: '1 minute' },
          { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
        ]
      }
    ]
  }
];

export const recoveryDay = {
  day: 'Sunday',
  title: 'Active Recovery',
  color: 'bg-purple-500',
  goal: '30–60 min walk, yoga, or swim',
  finisher: '10-min leg raises + abs + Full-body mobility',
  exercises: [
    {
      id: 'abs-sun',
      name: 'Abs',
      sets: 1,
      reps: 'See below',
      category: 'abs',
      muscleGroups: ['abs'],
      subExercises: [
        { name: 'Lying Leg Raises', sets: 3, reps: '15' },
        { name: 'Reverse Crunches', sets: 3, reps: '15' },
        { name: 'Plank Hold', sets: 3, reps: '1 minute' },
        { name: 'Toe Touches (Optional)', sets: 2, reps: '20' },
        { name: 'Hanging Leg Raises', sets: 3, reps: '10' }
      ]
    }
  ]
};