
import { useState } from "react";
import { ChevronLeft, ChevronRight, Crown, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useCalendarSessions, useSessionsByDate } from "@/hooks/useCalendarSessions";

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 5)); // June 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: calendarSessions = {} } = useCalendarSessions();
  const { data: selectedSessions = [] } = useSessionsByDate(selectedDate || '');

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getDateKey = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const getCategoryColor = (weight: string) => {
    switch (weight) {
      case "Light": return "bg-emerald-500";
      case "Medium": return "bg-blue-500";
      case "Heavy": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const handleDateClick = (day: number) => {
    const dateKey = getDateKey(day);
    if (calendarSessions[dateKey]) {
      setSelectedDate(dateKey);
      setIsDrawerOpen(true);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  // Group selected sessions by game
  const groupedSessions = selectedSessions.reduce((acc, session) => {
    if (!acc[session.game_name]) {
      acc[session.game_name] = {
        game_name: session.game_name,
        location: session.location,
        duration_minutes: session.duration_minutes,
        highlights: session.highlights,
        players: []
      };
    }
    acc[session.game_name].players.push({
      name: session.player_name,
      score: session.score,
      is_winner: session.is_winner
    });
    return acc;
  }, {} as Record<string, any>);

  return (
    <div className="space-y-6">
      {/* Calendar Container */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <ChevronLeft className="h-6 w-6 text-gray-400" />
          </button>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <ChevronRight className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-12" />;
              }

              const dateKey = getDateKey(day);
              const sessionData = calendarSessions[dateKey];
              const hasGames = sessionData && sessionData.sessions > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    group h-12 rounded-2xl flex flex-col items-center justify-center relative
                    transition-all duration-200 font-medium text-base
                    ${hasGames 
                      ? 'bg-meeple-gold-500 hover:bg-meeple-gold-600 text-white shadow-sm hover:shadow-md' 
                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <span className="group-hover:font-semibold transition-all">{day}</span>
                  {hasGames && (
                    <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${getCategoryColor(sessionData.weight)}`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Game Sessions Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent className="max-h-[70vh]">
          <DrawerHeader className="pb-4">
            <DrawerTitle className="font-poppins text-xl">
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DrawerTitle>
          </DrawerHeader>
          
          <div className="px-6 pb-6 space-y-4 overflow-y-auto">
            {Object.values(groupedSessions).map((session: any, index) => (
              <Card key={index} className="border-gray-200 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">🎲</div>
                      <h4 className="font-poppins font-bold text-lg">{session.game_name}</h4>
                    </div>
                  </div>

                  {/* Players and Scores */}
                  <div className="space-y-3 mb-4">
                    {session.players.map((player: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-poppins font-semibold">
                              {player.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-inter font-medium">{player.name}</span>
                          {player.is_winner && <Crown className="h-4 w-4 text-meeple-gold-500" />}
                        </div>
                        <Badge variant="outline" className="font-mono font-bold">
                          {player.score}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Session Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="font-inter">{session.duration_minutes}min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="font-inter">{session.location}</span>
                    </div>
                  </div>

                  {session.highlights && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-l-4 border-orange-400">
                      <p className="text-sm font-inter italic text-gray-600">{session.highlights}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CalendarView;
