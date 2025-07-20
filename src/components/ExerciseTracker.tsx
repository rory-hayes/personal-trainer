import React, { useState, useEffect } from 'react';
import { Plus, Minus, Check, RotateCcw, Timer, TrendingUp, Bot, Zap, Target } from 'lucide-react';
import { Exercise, WorkoutSet } from '../types/workout';
import { useWorkoutData } from '../hooks/useWorkoutData';

interface ExerciseTrackerProps {
  exercise: Exercise;
  exerciseIndex: number;
  onComplete: (exerciseIndex: number) => void;
  isCompleted: boolean;
  workoutDay: string;
  workoutSessionId: string | null;
}

export function ExerciseTracker({
  exercise,
  exerciseIndex,
  onComplete,
  isCompleted,
  workoutDay,
  workoutSessionId
}: ExerciseTrackerProps) {
  const { saveExerciseSet, getWorkoutExerciseId } = useWorkoutData();

  // All hooks must be called before any conditional logic
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [lastWeight, setLastWeight] = useState(0);
  const [showAISuggestion, setShowAISuggestion] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [workoutExerciseId, setWorkoutExerciseId] = useState<string | null>(null);

  // Initialize sets when exercise changes
  useEffect(() => {
    if (!exercise.subExercises || exercise.subExercises.length === 0) {
      const initialSets: WorkoutSet[] = Array.from({ length: exercise.sets }, (_, i) => ({
        id: `${exercise.id}-set-${i + 1}`,
        exercise_id: exercise.id,
        weight: lastWeight,
        reps: 0,
        completed: false
      }));
      setSets(initialSets);
      setCurrentSetIndex(0);
    }
  }, [exercise.id, exercise.sets, lastWeight, exercise.subExercises]);

  // Get workout exercise ID when component mounts
  useEffect(() => {
    const fetchWorkoutExerciseId = async () => {
      if (workoutSessionId && (!exercise.subExercises || exercise.subExercises.length === 0)) {
        try {
          const id = await getWorkoutExerciseId(workoutSessionId, exercise.name);
          setWorkoutExerciseId(id);
        } catch (error) {
          console.error('Failed to get workout exercise ID:', error);
        }
      }
    };
    
    fetchWorkoutExerciseId();
  }, [workoutSessionId, exercise.name, exercise.subExercises]);

  // Generate AI suggestions based on performance
  useEffect(() => {
    if (exercise.subExercises && exercise.subExercises.length > 0) return;
    
    const completedSets = sets.filter(set => set.completed);
    if (completedSets.length >= 2) {
      const avgReps = completedSets.reduce((sum, set) => sum + set.reps, 0) / completedSets.length;
      const targetRepsRange = getTargetReps();
      const maxTarget = targetRepsRange.length === 2 ? targetRepsRange[1] : targetRepsRange[0];
      
      if (avgReps >= maxTarget && !showAISuggestion) {
        setAiSuggestion(`Great form! You're hitting the upper rep range consistently. Consider increasing weight by 2.5-5kg next session.`);
        setShowAISuggestion(true);
      } else if (avgReps < targetRepsRange[0] && !showAISuggestion) {
        setAiSuggestion(`Focus on form over weight. Consider reducing weight by 2.5kg to hit the target rep range.`);
        setShowAISuggestion(true);
      }
    }
  }, [sets, showAISuggestion, exercise.subExercises]);

  // Rest timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isResting, restTimer]);

  if (exercise.subExercises && exercise.subExercises.length > 0) {
    return (
      <div className="p-4 space-y-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{exercise.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {exercise.muscleGroups.map(muscle => (
                <span
                  key={muscle}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize font-medium"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            {exercise.subExercises.map(sub => (
              <li key={sub.name} className="text-sm">
                {sub.name} - {sub.sets} × {sub.reps}
              </li>
            ))}
          </ul>
        </div>

        {!isCompleted ? (
          <button
            onClick={() => onComplete(exerciseIndex)}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95"
          >
            Complete Exercise
          </button>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <div className="text-green-700 font-bold text-xl mb-3">🎉 Exercise Complete!</div>
            <div className="text-base text-green-600 font-medium">Great job! Moving to the next exercise...</div>
          </div>
        )}
      </div>
    );
  }

  const updateSet = (setIndex: number, field: 'weight' | 'reps', value: number) => {
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, [field]: value } : set
    ));
  };

  const completeSet = async (setIndex: number) => {
    const currentSet = sets[setIndex];
    
    // Save to database if we have the workout exercise ID
    if (workoutExerciseId && currentSet.weight > 0 && currentSet.reps > 0) {
      try {
        await saveExerciseSet({
          workout_exercise_id: workoutExerciseId,
          set_number: setIndex + 1,
          weight_kg: currentSet.weight,
          reps: currentSet.reps,
          completed: true,
        });
      } catch (error) {
        console.error('Failed to save exercise set:', error);
        // Continue with local tracking even if database fails
      }
    }
    
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, completed: true } : set
    ));

    // Start rest timer for compound vs isolation exercises
    const restTime = exercise.category === 'compound' ? 180 : 90; // 3min vs 1.5min
    setRestTimer(restTime);
    setIsResting(true);

    // Move to next set
    if (setIndex < sets.length - 1) {
      setCurrentSetIndex(setIndex + 1);
    } else {
      // All sets completed
      setTimeout(() => onComplete(exerciseIndex), 500);
    }
  };

  const resetSet = (setIndex: number) => {
    setSets(prev => prev.map((set, index) => 
      index === setIndex ? { ...set, completed: false, reps: 0 } : set
    ));
  };

  const quickWeightAdjust = (setIndex: number, increment: number) => {
    updateSet(setIndex, 'weight', Math.max(0, sets[setIndex].weight + increment));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTargetReps = () => {
    const repsRange = exercise.reps;
    if (repsRange.includes('-')) {
      return repsRange.split('-').map(r => parseInt(r.trim()));
    }
    if (repsRange.includes('each')) {
      return [parseInt(repsRange.split(' ')[0])];
    }
    return [parseInt(repsRange)];
  };

  const targetReps = getTargetReps();
  const completedSets = sets.filter(set => set.completed).length;

  const dismissAISuggestion = () => {
    setShowAISuggestion(false);
  };

  return (
    <div className="p-4 space-y-6 pb-8">
      {/* AI Suggestion Banner */}
      {showAISuggestion && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-900 text-sm">AI Trainer Suggestion</span>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">{aiSuggestion}</p>
            </div>
            <button
              onClick={dismissAISuggestion}
              className="text-blue-400 hover:text-blue-600 p-1 -m-1"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Exercise Header */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">{exercise.name}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {exercise.muscleGroups.map(muscle => (
                <span
                  key={muscle}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize font-medium"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 font-medium">Target</div>
            <div className="font-bold text-gray-900 text-lg">
              {exercise.sets} × {exercise.reps}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600 font-medium">
                {completedSets}/{exercise.sets} sets
              </span>
            </div>
          </div>
          
          {isResting && (
            <div className="flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full">
              <Timer className="w-5 h-5" />
              <span className="font-mono text-base font-bold">{formatTime(restTimer)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Sets Tracking */}
      <div className="space-y-4">
        {sets.map((set, index) => {
          const isCurrentSet = index === currentSetIndex;
          const isActiveSet = !set.completed && (isCurrentSet || completedSets === index);
          
          return (
            <div
              key={set.id}
              className={`
                bg-white rounded-2xl p-5 border-2 transition-all duration-200
                ${set.completed 
                  ? 'border-green-300 bg-green-50' 
                  : isActiveSet
                    ? 'border-blue-400 shadow-lg'
                    : 'border-gray-200'
                }
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-base font-bold
                    ${set.completed 
                      ? 'bg-green-500 text-white' 
                      : isActiveSet
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {set.completed ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">Set {index + 1}</div>
                    {targetReps.length === 2 ? (
                      <div className="text-sm text-gray-600 font-medium">
                        Target: {targetReps[0]}-{targetReps[1]} reps
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600 font-medium">
                        Target: {targetReps[0]} reps
                      </div>
                    )}
                  </div>
                </div>

                {set.completed && (
                  <button
                    onClick={() => resetSet(index)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 p-2 -m-2 rounded-lg active:bg-gray-100"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Reset
                  </button>
                )}
              </div>

              {!set.completed && (
                <div className="space-y-6">
                  {/* Weight Control */}
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-3">
                      Weight (kg)
                    </label>
                    <div className="flex justify-center">
                      <div className="w-32">
                        <input
                          type="number"
                          value={set.weight || ''}
                          onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="w-full h-16 text-center border-2 border-gray-300 rounded-xl font-mono text-2xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                          step="0.5"
                          min="0"
                          inputMode="decimal"
                        />
                        <div className="text-center text-sm text-gray-500 mt-1">kg</div>
                      </div>
                    </div>
                  </div>

                  {/* Reps Control */}
                  <div>
                    <label className="block text-base font-bold text-gray-700 mb-4 text-center">
                      Reps Completed
                    </label>
                    <div className="flex items-center justify-center gap-6">
                      <button
                        onClick={() => updateSet(index, 'reps', Math.max(0, set.reps - 1))}
                        className="w-16 h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Minus className="w-6 h-6" />
                      </button>
                      
                      <div className="w-20 h-20 bg-blue-50 border-3 border-blue-300 rounded-2xl flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-900">{set.reps}</span>
                      </div>
                      
                      <button
                        onClick={() => updateSet(index, 'reps', set.reps + 1)}
                        className="w-16 h-16 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-full flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Complete Set Button */}
                  <button
                    onClick={() => completeSet(index)}
                    disabled={set.reps === 0}
                    className={`
                      w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 active:scale-95
                      ${set.reps > 0
                        ? 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    Complete Set {index + 1}
                  </button>
                </div>
              )}

              {set.completed && (
                <div className="text-center py-4">
                  <span className="text-green-700 font-bold text-lg">
                    ✓ {set.weight}kg × {set.reps} reps
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Complete State */}
      {completedSets === exercise.sets && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
          <div className="text-green-700 font-bold text-xl mb-3">
            🎉 Exercise Complete!
          </div>
          <div className="text-base text-green-600 font-medium">
            Great job! Moving to the next exercise...
          </div>
        </div>
      )}
    </div>
  );
}