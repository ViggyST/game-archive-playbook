
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
      case "Light": return "bg-emerald-500 shadow-emerald-300/50";
      case "Medium": return "bg-sky-blue-500 shadow-sky-blue-300/50";
      case "Heavy": return "bg-red-500 shadow-red-300/50";
      default: return "bg-muted-foreground shadow-muted/50";
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
      {/* Month Navigation - Modern Minimalist */}
      <div className="bg-background/60 backdrop-blur-xl rounded-3xl border border-border/30 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6">
          <button
            onClick={() => navigateMonth('prev')}
            className="group p-4 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <ChevronLeft className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
          
          <div className="text-center">
            <h2 className="font-poppins font-bold text-3xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              {monthNames[currentMonth.getMonth()]}
            </h2>
            <p className="font-inter text-lg font-medium text-muted-foreground mt-1">
              {currentMonth.getFullYear()}
            </p>
          </div>
          
          <button
            onClick={() => navigateMonth('next')}
            className="group p-4 rounded-2xl hover:bg-muted/40 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        </div>
      </div>

      {/* Calendar Grid - Modern iOS Style */}
      <div className="bg-background/80 backdrop-blur-xl rounded-3xl border border-border/20 shadow-2xl overflow-hidden">
        <div className="p-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-8">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-inter font-bold text-muted-foreground/80 py-4 uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-14" />;
              }

              const dateKey = getDateKey(day);
              const sessionData = calendarSessions[dateKey];
              const hasGames = sessionData && sessionData.sessions > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    group h-14 rounded-2xl flex flex-col items-center justify-center relative
                    transition-all duration-300 transform-gpu font-inter font-semibold
                    ${hasGames 
                      ? 'bg-gradient-to-br from-muted/20 to-muted/40 hover:from-muted/40 hover:to-muted/60 text-foreground shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 border border-border/30 hover:border-border/60' 
                      : 'hover:bg-muted/20 text-muted-foreground hover:text-foreground hover:scale-105 hover:shadow-sm'
                    }
                    hover:-translate-y-0.5 active:translate-y-0
                  `}
                >
                  <span className="text-sm font-medium group-hover:font-semibold transition-all">{day}</span>
                  {hasGames && (
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div
                        className={`w-2 h-2 rounded-full ${getCategoryColor(sessionData.weight)} shadow-lg group-hover:w-3 group-hover:h-3 group-hover:shadow-xl transition-all duration-300 ring-2 ring-background/50`}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend - Minimalist */}
      <div className="bg-background/60 backdrop-blur-xl rounded-2xl border border-border/20 shadow-lg overflow-hidden">
        <div className="p-6">
          <h3 className="font-inter font-semibold text-sm mb-4 text-muted-foreground uppercase tracking-wider">Complexity</h3>
          <div className="flex justify-between">
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/20 transition-colors">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-lg ring-2 ring-background/50" />
              <span className="text-sm font-medium text-foreground">Light</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/20 transition-colors">
              <div className="w-4 h-4 rounded-full bg-sky-blue-500 shadow-lg ring-2 ring-background/50" />
              <span className="text-sm font-medium text-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/20 transition-colors">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg ring-2 ring-background/50" />
              <span className="text-sm font-medium text-foreground">Heavy</span>
            </div>
          </div>
        </div>
      </div>

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
