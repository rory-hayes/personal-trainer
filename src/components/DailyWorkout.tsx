import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Target, Trophy, Bot, TrendingUp, Zap } from 'lucide-react';
import { WorkoutDay } from '../types/workout';
import { ExerciseTracker } from './ExerciseTracker';
import { useWorkoutData } from '../hooks/useWorkoutData';

interface DailyWorkoutProps {
  workout: WorkoutDay;
  onBack: () => void;
}

export function DailyWorkout({ workout, onBack }: DailyWorkoutProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<number>>(new Set());
  const [workoutSummary, setWorkoutSummary] = useState<string>('');
  const [showSummary, setShowSummary] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { createWorkoutSession, completeWorkoutSession } = useWorkoutData();
  const [currentWorkoutSessionId, setCurrentWorkoutSessionId] = useState<string | null>(null);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Generate workout summary when all exercises are completed
  useEffect(() => {
    if (completedExercises.size === workout.exercises.length && completedExercises.size > 0) {
      generateWorkoutSummary();
    }
  }, [completedExercises.size, workout.exercises.length]);

  const generateWorkoutSummary = () => {
    const workoutTime = Math.floor(elapsedTime / 60);
    const summaries = [
      `Excellent ${workout.day} session! You completed all ${workout.exercises.length} exercises in ${workoutTime} minutes. Your consistency is building strength - keep this momentum going!`,
      `Strong ${workout.day} workout completed! ${workoutTime} minutes of focused training. Your progressive overload approach is working - consider small weight increases where you hit upper rep ranges.`,
      `Great ${workout.day} session! All exercises completed in ${workoutTime} minutes. Your form and consistency are key to long-term gains. Recovery and nutrition are just as important as the workout itself.`,
      `Solid ${workout.day} training! ${workoutTime} minutes well spent. Track your weights for next session - aim for progressive overload by increasing weight when you can complete all sets in the upper rep range.`
    ];
    
    setWorkoutSummary(summaries[Math.floor(Math.random() * summaries.length)]);
    setShowSummary(true);
  };
  
  const startWorkout = async () => {
    if (!startTime) {
      setStartTime(new Date());
      
      // Create workout session in database
      try {
        const sessionData = {
          workout_day: workout.day,
          workout_title: workout.title,
          workout_color: workout.color,
          exercises: workout.exercises.map((exercise, index) => ({
            exercise_name: exercise.name,
            planned_sets: exercise.sets,
            planned_reps: exercise.reps,
            exercise_order: index + 1,
          }))
        };
        
        const session = await createWorkoutSession(sessionData);
        setCurrentWorkoutSessionId(session.id);
        console.log('Workout session created:', session.id);
      } catch (error) {
        console.error('Failed to create workout session:', error);
        setError('Failed to start workout session. Continuing with local tracking.');
        // Continue with local tracking even if database fails
      }
    }
    setIsActive(true);
  };

  const pauseWorkout = async () => {
    setIsActive(false);
  };

  const resetWorkout = async () => {
    setIsActive(false);
    setStartTime(null);
    setElapsedTime(0);
    setCurrentExerciseIndex(0);
    setCompletedExercises(new Set());
    setCurrentWorkoutSessionId(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleExerciseComplete = (exerciseIndex: number) => {
    setCompletedExercises(prev => new Set([...prev, exerciseIndex]));
    
    // If all exercises are completed, save workout to database
    if (exerciseIndex === workout.exercises.length - 1) {
      handleWorkoutComplete();
    }
    
    // Auto-advance to next exercise
    if (exerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    }
  };

  const handleWorkoutComplete = async () => {
    if (currentWorkoutSessionId && startTime) {
      try {
        const durationMinutes = Math.floor(elapsedTime / 60);
        const completedSession = await completeWorkoutSession(currentWorkoutSessionId, durationMinutes);
        console.log('Workout completed and saved:', completedSession);
      } catch (error) {
        console.error('Failed to complete workout session:', error);
        setError('Failed to save workout completion. Data tracked locally.');
      }
    }
  };

  const progressPercentage = (completedExercises.size / workout.exercises.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`${workout.color} text-white p-5 shadow-lg`}>
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/90 hover:text-white transition-colors p-2 -m-2 rounded-lg active:bg-white/10"
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-2">
            {!isActive && !startTime && (
              <button
                onClick={startWorkout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl transition-colors font-medium"
              >
                <Play className="w-5 h-5" />
                <span>Start</span>
              </button>
            )}
            
            {isActive && (
              <button
                onClick={pauseWorkout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-3 rounded-xl transition-colors font-medium"
              >
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </button>
            )}
            
            {startTime && (
              <button
                onClick={resetWorkout}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-3 rounded-xl transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-bold">{workout.title}</h1>
          <p className="text-white/90 text-base leading-relaxed">{workout.goal}</p>
          
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span className="text-base font-medium">
                  {completedExercises.size}/{workout.exercises.length} exercises
                </span>
              </div>
              
              {startTime && (
                <div className="text-lg font-mono font-bold">
                  {formatTime(elapsedTime)}
                </div>
              )}
            </div>
            
            {progressPercentage > 0 && (
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span className="text-base font-bold">{Math.round(progressPercentage)}%</span>
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mt-4">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Exercise Navigation */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {workout.exercises.map((exercise, index) => (
            <button
              key={exercise.id}
              onClick={() => setCurrentExerciseIndex(index)}
              className={`
                flex-shrink-0 px-4 py-3 rounded-xl text-sm font-bold transition-all min-w-max active:scale-95
                ${currentExerciseIndex === index
                  ? 'bg-blue-500 text-white shadow-lg'
                  : completedExercises.has(index)
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                }
              `}
            >
              {index + 1}. {exercise.name.split(' ').slice(0, 1).join(' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Current Exercise */}
      <div className="flex-1">
        {workout.exercises[currentExerciseIndex] && (
          <ExerciseTracker
            exercise={workout.exercises[currentExerciseIndex]}
            exerciseIndex={currentExerciseIndex}
            onComplete={handleExerciseComplete}
            isCompleted={completedExercises.has(currentExerciseIndex)}
            workoutDay={workout.day}
            workoutSessionId={currentWorkoutSessionId}
          />
        )}
      </div>

      {/* Finisher Info */}
      {completedExercises.size === workout.exercises.length && !showSummary && (
        <div className="p-5 bg-green-50 border-t border-green-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-900 text-lg">Workout Complete! 🎉</h3>
              <p className="text-sm text-green-700 mt-1">Finisher: {workout.finisher}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Workout Summary Modal */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Workout Complete! 🎉</h3>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900 text-sm">AI Trainer Analysis</span>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">{workoutSummary}</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowSummary(false)}
                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}