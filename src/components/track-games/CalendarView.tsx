
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
      case "Light": return "bg-emerald-400 shadow-emerald-200";
      case "Medium": return "bg-sky-blue-400 shadow-sky-200";
      case "Heavy": return "bg-red-400 shadow-red-200";
      default: return "bg-gray-400 shadow-gray-200";
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
      {/* Month Navigation - Apple Style */}
      <Card className="bg-gradient-to-r from-background via-muted/30 to-background border-none shadow-2xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-r from-muted/20 to-muted/10">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-3 rounded-full hover:bg-background/60 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <h2 className="font-poppins font-bold text-2xl text-center bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-3 rounded-full hover:bg-background/60 transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid - Apple Style */}
      <Card className="shadow-2xl border-none overflow-hidden bg-gradient-to-br from-background via-muted/10 to-background">
        <CardContent className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-2 mb-6">
            {dayNames.map(day => (
              <div key={day} className="text-center text-sm font-poppins font-bold text-muted-foreground py-3 uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-16" />;
              }

              const dateKey = getDateKey(day);
              const sessionData = calendarSessions[dateKey];
              const hasGames = sessionData && sessionData.sessions > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    h-16 rounded-2xl flex flex-col items-center justify-center relative
                    transition-all duration-300 transform-gpu font-poppins font-semibold
                    ${hasGames 
                      ? 'bg-gradient-to-br from-background to-muted/40 hover:from-muted/60 hover:to-muted/40 text-foreground shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 border-2 border-muted/30 hover:border-muted/60' 
                      : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground hover:scale-105 hover:shadow-md'
                    }
                    hover:-translate-y-1 active:translate-y-0
                  `}
                >
                  <span className="text-base mb-1">{day}</span>
                  {hasGames && (
                    <div className="absolute bottom-2">
                      <div
                        className={`w-2 h-2 rounded-full ${getCategoryColor(sessionData.weight)} shadow-lg animate-pulse`}
                      />
                    </div>
                  )}
                  {hasGames && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-lg border-none bg-gradient-to-r from-background to-muted/20">
        <CardContent className="p-5">
          <h3 className="font-poppins font-bold text-sm mb-4 text-muted-foreground uppercase tracking-wide">Game Complexity</h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-lg ring-2 ring-emerald-400/30" />
              <span className="text-sm font-inter font-semibold">Light</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-sky-blue-400 shadow-lg ring-2 ring-sky-blue-400/30" />
              <span className="text-sm font-inter font-semibold">Medium</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg ring-2 ring-red-400/30" />
              <span className="text-sm font-inter font-semibold">Heavy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Sessions Drawer - Bottom Sheet Style */}
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
              <Card key={index} className="border-border/40 shadow-lg">
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
                      <div key={idx} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
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
                    <div className="mt-3 p-3 bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg border-l-4 border-meeple-gold-500">
                      <p className="text-sm font-inter italic text-muted-foreground">{session.highlights}</p>
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
