import React from 'react';
import { Calendar, TrendingUp, Bot, Dumbbell } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: 'schedule', label: 'Training', icon: Calendar },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb shadow-lg">
      <div className="flex justify-around py-3 px-2">
        {navItems.map(item => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`
                flex flex-col items-center gap-2 py-2 px-4 rounded-xl transition-all active:scale-95
                ${isActive 
                  ? 'text-blue-600 bg-blue-50 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
            >
              <IconComponent className={`w-7 h-7 ${isActive ? 'text-blue-600' : ''}`} />
              <span className="text-xs font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}