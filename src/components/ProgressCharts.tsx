import React, { useState } from 'react';
import { TrendingUp, Calendar, Trophy, Target, ArrowLeft } from 'lucide-react';
import { workoutProgram } from '../data/workoutProgram';

interface ProgressChartsProps {
  onBack: () => void;
}

export function ProgressCharts({ onBack }: ProgressChartsProps) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');

  // Mock progress data - in real app this would come from Supabase
  const mockProgressData: Record<string, any[]> = {};

  const allExercises = workoutProgram.flatMap(day => day.exercises);
  
  const getExerciseProgress = (exerciseId: string) => {
    const data = mockProgressData[exerciseId] || [];
    return data;
  };

  const calculateOneRepMax = (weight: number, reps: number) => {
    // Epley formula: 1RM = weight × (1 + reps/30)
    return Math.round(weight * (1 + reps / 30));
  };

  const getPersonalRecord = (exerciseId: string) => {
    const progress = getExerciseProgress(exerciseId);
    if (progress.length === 0) return null;
    
    return progress.reduce((max, session) => {
      const oneRepMax = calculateOneRepMax(session.weight, session.reps);
      return oneRepMax > max.oneRepMax ? { ...session, oneRepMax } : max;
    }, { ...progress[0], oneRepMax: calculateOneRepMax(progress[0].weight, progress[0].reps) });
  };

  if (selectedExercise) {
    const exercise = allExercises.find(ex => ex.id === selectedExercise);
    const progress = getExerciseProgress(selectedExercise);
    const pr = getPersonalRecord(selectedExercise);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedExercise(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Exercises</span>
            </button>
            
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(period => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period)}
                  className={`
                    px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors
                    ${timeframe === period
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          
          <h1 className="text-xl font-bold text-gray-900">{exercise?.name}</h1>
          <p className="text-gray-600 text-sm">Progress tracking and analysis</p>
        </div>

        <div className="p-4 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Personal Record</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {pr ? `${pr.weight}kg` : 'No data'}
              </div>
              {pr && (
                <div className="text-sm text-gray-600">
                  {pr.reps} reps • Est. 1RM: {pr.oneRepMax}kg
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Progress</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {progress.length > 1 ? '+' + (progress[progress.length - 1].weight - progress[0].weight) + 'kg' : 'No data'}
              </div>
              <div className="text-sm text-gray-600">
                {progress.length > 0 ? `${progress.length} sessions tracked` : 'Start tracking to see progress'}
              </div>
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Weight Progression
            </h3>
            
            {progress.length > 0 ? (
              <div className="space-y-4">
                {/* Simple text-based chart */}
                <div className="space-y-2">
                  {progress.map((session, index) => (
                    <div key={session.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm font-medium">
                          {new Date(session.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{session.weight}kg × {session.reps}</div>
                        <div className="text-xs text-gray-600">Volume: {session.volume}kg</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Start tracking this exercise to see progress charts</p>
              </div>
            )}
          </div>

          {/* Training Notes */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-2">Training Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Increase weight when you can complete all sets in the upper rep range</li>
              <li>• Focus on progressive overload - small consistent increases</li>
              <li>• Track your form quality alongside the numbers</li>
              <li>• Deload weeks help prevent plateaus and injury</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Analytics</h1>
            <p className="text-gray-600">Track your strength gains and personal records</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Overall Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-600">New PRs</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <div className="text-2xl font-bold text-purple-600">0hr</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
        </div>

        {/* Exercise List by Category */}
        {workoutProgram.map(day => (
          <div key={day.day} className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded-full ${day.color}`} />
              <h3 className="font-semibold text-gray-900">{day.title}</h3>
            </div>
            
            <div className="space-y-2">
              {day.exercises.map(exercise => {
                const pr = getPersonalRecord(exercise.id);
                const progress = getExerciseProgress(exercise.id);
                
                return (
                  <button
                    key={exercise.id}
                    onClick={() => setSelectedExercise(exercise.id)}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{exercise.name}</div>
                        <div className="text-sm text-gray-600">
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                      </div>
                      <div className="text-right">
                        {pr ? (
                          <>
                            <div className="font-semibold text-gray-900">PR: {pr.weight}kg</div>
                            <div className="text-sm text-gray-600">{progress.length} sessions</div>
                          </>
                        ) : (
                          <div className="text-sm text-gray-500">No data</div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}