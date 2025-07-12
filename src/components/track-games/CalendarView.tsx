import { useState } from "react";
import { ChevronLeft, ChevronRight, Crown, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Mock data for game sessions
const mockSessions = {
  "2024-12-05": [
    {
      id: 1,
      game: "Azul",
      category: "Medium",
      players: [
        { name: "Vignesh", score: 82, winner: false },
        { name: "Shwetha", score: 97, winner: true },
        { name: "Vishnu", score: 76, winner: false }
      ],
      duration: 45,
      location: "Home",
      highlights: "Shwetha maxed tile synergy."
    }
  ],
  "2024-12-07": [
    {
      id: 2,
      game: "Codenames",
      category: "Light",
      players: [
        { name: "Vignesh", score: 0, winner: true },
        { name: "Vishnu", score: 0, winner: true },
        { name: "Shwetha", score: 0, winner: false }
      ],
      duration: 30,
      location: "Cafe",
      highlights: "Perfect streak with no wrong guesses."
    }
  ],
  "2024-12-09": [
    {
      id: 3,
      game: "Terraforming Mars",
      category: "Heavy",
      players: [
        { name: "Vignesh", score: 95, winner: true },
        { name: "Vishnu", score: 89, winner: false }
      ],
      duration: 100,
      location: "Online",
      highlights: "Close match with two engine builds."
    }
  ],
  "2024-12-12": [
    {
      id: 4,
      game: "Jaipur",
      category: "Light",
      players: [
        { name: "Vignesh", score: 104, winner: false },
        { name: "Shwetha", score: 118, winner: true }
      ],
      duration: 20,
      location: "Home",
      highlights: "Shwetha stays undefeated in Jaipur."
    }
  ]
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11)); // December 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Light": return "bg-emerald-500";
      case "Medium": return "bg-sky-blue-500";
      case "Heavy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleDateClick = (day: number) => {
    const dateKey = getDateKey(day);
    if (mockSessions[dateKey]) {
      setSelectedDate(dateKey);
      setIsDialogOpen(true);
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
  const selectedSessions = selectedDate ? mockSessions[selectedDate] || [] : [];

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <Card className="bg-gradient-to-r from-meeple-gold-500/10 to-sky-blue-500/10 border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <h2 className="font-poppins font-semibold text-xl text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-lg border-border/40">
        <CardContent className="p-4">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-inter font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="h-12" />;
              }

              const dateKey = getDateKey(day);
              const sessions = mockSessions[dateKey];
              const hasGames = sessions && sessions.length > 0;

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`
                    h-12 rounded-lg flex flex-col items-center justify-center relative
                    transition-all duration-200 hover:scale-105
                    ${hasGames 
                      ? 'bg-muted/50 hover:bg-muted text-foreground font-medium' 
                      : 'hover:bg-muted/30 text-muted-foreground'
                    }
                  `}
                >
                  <span className="text-sm">{day}</span>
                  {hasGames && (
                    <div className="flex gap-1 mt-1">
                      {sessions.map((session, idx) => (
                        <div
                          key={idx}
                          className={`w-2 h-2 rounded-full ${getCategoryColor(session.category)}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="shadow-lg border-border/40">
        <CardContent className="p-4">
          <h3 className="font-poppins font-medium text-sm mb-3 text-muted-foreground">Game Categories</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm font-inter">Light</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sky-blue-500" />
              <span className="text-sm font-inter">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm font-inter">Heavy</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Sessions Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="font-poppins">
              {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedSessions.map((session) => (
              <Card key={session.id} className="border-border/40">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-poppins font-semibold text-lg">{session.game}</h4>
                      <Badge variant="secondary" className="mt-1">
                        {session.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Players and Scores */}
                  <div className="space-y-2 mb-4">
                    {session.players.map((player, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {player.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-inter text-sm">{player.name}</span>
                          {player.winner && <Crown className="h-4 w-4 text-meeple-gold-500" />}
                        </div>
                        <span className="font-mono text-sm">{player.score}</span>
                      </div>
                    ))}
                  </div>

                  {/* Session Details */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{session.duration}min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                    </div>
                  </div>

                  {session.highlights && (
                    <div className="mt-3 p-2 bg-muted/50 rounded-md">
                      <p className="text-sm font-inter italic">{session.highlights}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;