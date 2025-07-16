
import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Clock, MapPin, Trophy, Users } from "lucide-react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isSameDay, isToday } from "date-fns";
import { useCalendarSessions, useSessionsByDate } from "@/hooks/useCalendarSessions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const { data: sessions = [], isLoading } = useCalendarSessions();
  const { data: daysSessions = [] } = useSessionsByDate(selectedDate || '');

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

  // Get complexity dots for a date - enhanced version
  const getComplexityIndicators = (date: Date) => {
    const dateSessions = getSessionsForDate(date);
    if (dateSessions.length === 0) return [];
    
    // Group by complexity and count
    const complexityGroups = dateSessions.reduce((acc, session) => {
      const weight = session.game_weight || 'Medium';
      acc[weight] = (acc[weight] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Create indicators in order: Light, Medium, Heavy
    const indicators = [];
    
    if (complexityGroups['Light']) {
      indicators.push({
        type: 'Light',
        count: complexityGroups['Light'],
        className: 'w-2 h-2 bg-emerald-500 rounded-full animate-scale-in',
        icon: null
      });
    }
    
    if (complexityGroups['Medium']) {
      indicators.push({
        type: 'Medium', 
        count: complexityGroups['Medium'],
        className: 'w-2.5 h-2.5 bg-sky-500 rounded-full animate-scale-in',
        icon: null
      });
    }
    
    if (complexityGroups['Heavy']) {
      indicators.push({
        type: 'Heavy',
        count: complexityGroups['Heavy'], 
        className: 'w-3 h-3 bg-red-500 rounded-full animate-scale-in relative',
        icon: '🔥'
      });
    }

    return indicators.slice(0, 3); // Max 3 indicators
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const dateSessions = getSessionsForDate(date);
    if (dateSessions.length > 0) {
      setSelectedDate(format(date, 'yyyy-MM-dd'));
    }
  };

  // Format duration for display
  const formatDuration = (minutes: number) => {
    if (!minutes) return 'Unknown duration';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  // Group sessions by game for the modal
  const groupedSessions = daysSessions.reduce((acc, session) => {
    const key = session.game_name;
    if (!acc[key]) {
      acc[key] = {
        game_name: session.game_name,
        location: session.location,
        duration_minutes: session.duration_minutes,
        highlights: session.highlights,
        players: []
      };
    }
    acc[key].players.push({
      name: session.player_name,
      score: session.score,
      is_winner: session.is_winner
    });
    return acc;
  }, {} as Record<string, any>);

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
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">
            {format(currentDate, 'MMMM')}
          </h2>
          <p className="text-lg text-gray-500 font-inter">
            {format(currentDate, 'yyyy')}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
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
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2 font-inter">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-14" />
          ))}
          
          {/* Month days */}
          {daysInMonth.map((date) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const dateSessions = getSessionsForDate(date);
            const hasGames = dateSessions.length > 0;
            const complexityIndicators = getComplexityIndicators(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`
                  relative h-14 rounded-xl border transition-all duration-200 flex flex-col items-center justify-center
                  ${isCurrentMonth 
                    ? hasGames 
                      ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-800 font-semibold shadow-sm hover:shadow-md cursor-pointer hover:scale-105 transform' 
                      : isTodayDate
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-800 font-semibold'
                        : 'bg-white border-gray-100 text-gray-900 hover:bg-gray-50'
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                  }
                  ${isTodayDate && !hasGames ? 'ring-2 ring-blue-200 ring-opacity-50' : ''}
                `}
              >
                {/* Date number */}
                <div className={`text-sm font-medium font-inter ${isTodayDate ? 'relative' : ''}`}>
                  {format(date, 'd')}
                  {isTodayDate && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Complexity indicators */}
                {hasGames && (
                  <div className="flex gap-1 mt-1">
                    {complexityIndicators.map((indicator, index) => (
                      <div
                        key={`${indicator.type}-${index}`}
                        className={indicator.className}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {indicator.icon && (
                          <span className="absolute inset-0 flex items-center justify-center text-xs">
                            {indicator.icon}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Complexity Legend */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="text-center">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4 font-inter">Game Complexity</h3>
          <div className="flex justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700 font-inter">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-sky-500 rounded-full shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700 font-inter">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full shadow-sm relative">
                <span className="absolute inset-0 flex items-center justify-center text-xs">🔥</span>
              </div>
              <span className="text-sm font-medium text-gray-700 font-inter">Heavy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Game Details Modal */}
      <Sheet open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl border-t-0">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-xl font-bold text-gray-900 font-poppins">
              Games on {selectedDate && format(new Date(selectedDate), 'MMMM d, yyyy')}
            </SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4 overflow-y-auto h-full pb-20">
            {Object.values(groupedSessions).map((session: any, index) => (
              <Card key={index} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  {/* Game Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 font-poppins">
                        {session.game_name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        {session.duration_minutes && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="font-inter">{formatDuration(session.duration_minutes)}</span>
                          </div>
                        )}
                        {session.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span className="font-inter">{session.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Players Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 font-inter">Players</span>
                    </div>
                    
                    <div className="grid gap-2">
                      {session.players.map((player: any, playerIndex: number) => (
                        <div 
                          key={playerIndex}
                          className={`
                            flex items-center justify-between p-3 rounded-xl border transition-all duration-200
                            ${player.is_winner 
                              ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm' 
                              : 'bg-white border-gray-150 hover:bg-gray-50'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                              ${player.is_winner 
                                ? 'bg-yellow-200 text-yellow-800' 
                                : 'bg-gray-200 text-gray-700'
                              }
                            `}>
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-900 font-inter">{player.name}</span>
                            {player.is_winner && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                Winner
                              </Badge>
                            )}
                          </div>
                          
                          <div className="text-right">
                            <span className="text-lg font-bold text-gray-900 font-poppins">
                              {player.score}
                            </span>
                            <span className="text-sm text-gray-500 ml-1 font-inter">pts</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  {session.highlights && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h4 className="text-sm font-semibold text-blue-800 mb-2 font-inter">Highlights</h4>
                      <p className="text-sm text-blue-700 font-inter leading-relaxed">{session.highlights}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CalendarView;
