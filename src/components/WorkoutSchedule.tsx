import React from 'react';
import { Calendar, Target, Clock, ChevronRight } from 'lucide-react';
import { workoutProgram, recoveryDay } from '../data/workoutProgram';

interface WorkoutScheduleProps {
  onSelectDay: (dayIndex: number) => void;
  currentDay?: number;
}

export function WorkoutSchedule({ onSelectDay, currentDay }: WorkoutScheduleProps) {
  const allDays = [...workoutProgram, recoveryDay];
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to our 0-6 index (Monday = 0)

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Your Training Program</h1>
          <p className="text-sm text-gray-600">6-day Push/Pull/Legs split</p>
        </div>
      </div>

      <div className="space-y-4">
        {allDays.map((workout, index) => {
          const isToday = index === todayIndex;
          const isActive = currentDay === index;
          
          return (
            <button
              key={workout.day}
              onClick={() => onSelectDay(index)}
              className={`
                w-full p-5 rounded-2xl text-left transition-all duration-200 border-2 shadow-sm
                ${isActive 
                  ? 'border-blue-500 shadow-lg transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-gray-300 active:scale-[0.98]'
                }
                ${isToday ? 'ring-2 ring-blue-400 ring-opacity-30' : ''}
                bg-white hover:shadow-md active:shadow-lg
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${workout.color}`} />
                  <span className="font-bold text-lg text-gray-900">{workout.day}</span>
                  {isToday && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-bold">
                      Today
                    </span>
                  )}
                </div>
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2 text-base">{workout.title}</h3>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{workout.goal}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-500">
                  <Target className="w-4 h-4" />
                  <span className="text-sm font-medium">{workout.exercises.length || 0} exercises</span>
                </div>
                
                {workout.finisher && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="truncate max-w-32">Finisher included</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 p-5 bg-blue-50 rounded-2xl border border-blue-100">
        <h3 className="font-bold text-blue-900 mb-3 text-base">Training Notes</h3>
        <ul className="text-sm text-blue-800 space-y-2 leading-relaxed">
          <li>• Rest 2-3 minutes between compound exercises</li>
          <li>• Rest 1-2 minutes between isolation exercises</li>
          <li>• Increase weight when you can complete all sets with perfect form</li>
        </ul>
      </div>
    </div>
  );
}