
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay } from "date-fns";
import { useCalendarSessions } from "@/hooks/useCalendarSessions";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: sessions = [], isLoading } = useCalendarSessions();

  // Navigate months
  const goToPreviousMonth = () => {
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prevMonth);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(nextMonth);
  };

  // Calendar calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Get starting day of week (0 = Sunday)
  const startDay = getDay(monthStart);
  
  // Create empty cells for days before month starts
  const emptyCells = Array(startDay).fill(null);

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.date), date)
    );
  };

  // Get complexity dots for a date
  const getComplexityDots = (date: Date) => {
    const dateSessions = getSessionsForDate(date);
    const complexities = new Set(dateSessions.map(s => s.game_weight));
    
    return Array.from(complexities).map(weight => {
      switch (weight) {
        case 'Light': return 'bg-emerald-500';
        case 'Medium': return 'bg-sky-blue-500'; 
        case 'Heavy': return 'bg-red-500';
        default: return 'bg-gray-400';
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="bg-gray-200 h-8 w-32 rounded animate-pulse"></div>
          <div className="flex gap-2">
            <div className="bg-gray-200 h-10 w-10 rounded-full animate-pulse"></div>
            <div className="bg-gray-200 h-10 w-10 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Calendar skeleton */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 42 }).map((_, i) => (
            <div key={i} className="bg-gray-200 h-12 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-gray-900">
            {format(currentDate, 'MMMM')}
          </h2>
          <p className="text-lg text-gray-500">
            {format(currentDate, 'yyyy')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-12" />
          ))}
          
          {/* Month days */}
          {daysInMonth.map((date) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const dateSessions = getSessionsForDate(date);
            const hasGames = dateSessions.length > 0;
            const complexityDots = getComplexityDots(date);
            
            return (
              <div
                key={date.toISOString()}
                className={`
                  relative h-12 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center
                  ${isCurrentMonth 
                    ? hasGames 
                      ? 'bg-orange-50 border-orange-200 text-orange-800 font-semibold shadow-sm' 
                      : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                  }
                `}
              >
                {/* Date number */}
                <div className="text-sm font-medium">
                  {format(date, 'd')}
                </div>
                
                {/* Complexity dots */}
                {hasGames && (
                  <div className="flex gap-0.5 mt-0.5">
                    {complexityDots.slice(0, 3).map((colorClass, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full ${colorClass}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Complexity Legend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="text-center">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Complexity</h3>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Heavy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
