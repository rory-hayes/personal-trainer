import React, { useState } from 'react';
import { WorkoutSchedule } from './components/WorkoutSchedule';
import { DailyWorkout } from './components/DailyWorkout';
import { ProgressCharts } from './components/ProgressCharts';
import { Navigation } from './components/Navigation';
import { workoutProgram, recoveryDay } from './data/workoutProgram';
import { Dumbbell } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('schedule');
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState<number | null>(null);

  const handleSelectDay = (dayIndex: number) => {
    setSelectedWorkoutDay(dayIndex);
    setCurrentView('workout');
  };

  const handleBackToSchedule = () => {
    setSelectedWorkoutDay(null);
    setCurrentView('schedule');
  };

  const allDays = [...workoutProgram, recoveryDay];

  const renderCurrentView = () => {
    switch (currentView) {
      case 'workout':
        if (selectedWorkoutDay !== null) {
          return (
            <DailyWorkout
              workout={allDays[selectedWorkoutDay]}
              onBack={handleBackToSchedule}
            />
          );
        }
        return <WorkoutSchedule onSelectDay={handleSelectDay} />;
        
      case 'progress':
        return <ProgressCharts onBack={() => setCurrentView('schedule')} />;
        
      default:
        return (
          <WorkoutSchedule 
            onSelectDay={handleSelectDay}
            currentDay={selectedWorkoutDay || undefined}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header - only show on main views */}
      {currentView !== 'workout' && (
        <div className="bg-white border-b border-gray-200 p-4 pb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Personal Trainer</h1>
              <p className="text-gray-600 text-sm">Your AI-powered workout companion</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${currentView !== 'workout' ? 'pb-20' : ''}`}>
        {renderCurrentView()}
      </div>

      {/* Bottom Navigation - hide during workout */}
      {currentView !== 'workout' && (
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  );
}

export default App;