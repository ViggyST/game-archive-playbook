import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, Trophy, Users } from "lucide-react";
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

  // Get sessions for a specific date - Fixed date comparison
  const getSessionsForDate = (date: Date) => {
    return sessions.filter(session => 
      isSameDay(new Date(session.date + 'T00:00:00'), date)
    );
  };

  // Get unique complexity dots for a date
  const getComplexityDots = (date: Date) => {
    const dateSessions = getSessionsForDate(date);
    if (dateSessions.length === 0) return [];
    
    // Get unique complexities from the properly joined game data (normalize case)
    const complexities = [...new Set(dateSessions.map(session => session.game_weight?.toLowerCase()))];
    
    // Create dots in priority order: Light, Medium, Heavy
    const dots = [];
    
    if (complexities.includes('light')) {
      dots.push({ type: 'Light', color: 'bg-green-500' });
    }
    
    if (complexities.includes('medium')) {
      dots.push({ type: 'Medium', color: 'bg-blue-500' });
    }
    
    if (complexities.includes('heavy')) {
      dots.push({ type: 'Heavy', color: 'bg-red-500' });
    }

    return dots;
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
      {/* Calendar Header - Fully Centered */}
      <div className="flex items-center justify-center relative">
        <button
          onClick={goToPreviousMonth}
          className="absolute left-0 p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 font-poppins">
            {format(currentDate, 'MMMM')}
          </h2>
          <p className="text-xl text-gray-500 font-inter">
            {format(currentDate, 'yyyy')}
          </p>
        </div>
        
        <button
          onClick={goToNextMonth}
          className="absolute right-0 p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
        {/* Day Labels */}
        <div className="grid grid-cols-7 gap-3 mb-6">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-3 font-inter">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-3">
          {/* Empty cells for days before month starts */}
          {emptyCells.map((_, index) => (
            <div key={`empty-${index}`} className="h-28" />
          ))}
          
          {/* Month days */}
          {daysInMonth.map((date) => {
            const isCurrentMonth = isSameMonth(date, currentDate);
            const dateSessions = getSessionsForDate(date);
            const hasGames = dateSessions.length > 0;
            const complexityDots = getComplexityDots(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={date.toISOString()}
                onClick={() => handleDateClick(date)}
                className={`
                  relative h-28 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center overflow-hidden p-2
                  ${isCurrentMonth 
                    ? hasGames 
                      ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-orange-900 font-semibold shadow-lg hover:shadow-xl cursor-pointer hover:scale-105 transform' 
                      : isTodayDate
                        ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-900 font-semibold shadow-sm'
                        : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                    : 'bg-gray-50 border-gray-100 text-gray-400'
                  }
                  ${isTodayDate && !hasGames ? 'ring-2 ring-blue-300 ring-opacity-60' : ''}
                `}
              >
                {/* Date number */}
                <div className={`text-lg font-bold font-inter ${isTodayDate ? 'relative' : ''}`}>
                  {format(date, 'd')}
                  {isTodayDate && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                {/* Complexity dots below date number - Fixed rendering */}
                {hasGames && complexityDots.length > 0 && (
                  <div className="flex gap-1 mt-2 justify-center">
                    {complexityDots.map((dot, index) => (
                      <span
                        key={index}
                        className={`w-3 h-3 rounded-full ${dot.color} border border-white shadow-sm`}
                        aria-label={`${dot.type} game`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Multiple games indicator */}
                {hasGames && dateSessions.length > 1 && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    {dateSessions.length}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Complexity Legend */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="text-center">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4 font-inter">
            Game Complexity
          </h3>
          <div className="flex justify-center items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-500 font-inter">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-500 font-inter">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-500 font-inter">Heavy</span>
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
