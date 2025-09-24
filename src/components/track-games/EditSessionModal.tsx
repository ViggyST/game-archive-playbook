import { useState, useEffect, useMemo } from "react";
import { Edit2, Trash2, UndoIcon, Save, X, Crown, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { SessionData, SessionPlayer } from "@/types/session";
import { createCacheInvalidator } from "@/lib/cacheInvalidation";
import { usePlayerContext } from "@/context/PlayerContext";

// Use canonical SessionPlayer type with 'name' field (not player_name)
interface Player extends SessionPlayer {
  // Additional local state if needed
}

// Use canonical SessionData type
interface EditSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionData: SessionData;
  onSessionUpdated: () => void;
}

export const EditSessionModal = ({
  isOpen,
  onClose,
  sessionData,
  onSessionUpdated
}: EditSessionModalProps) => {
  const [isSaving, setIsSaving] = useState(false);  // Single-flight guard
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { player } = usePlayerContext();
  const { invalidateSessionData } = createCacheInvalidator(queryClient);

  // Form state
  const [formData, setFormData] = useState({
    date: new Date(sessionData.date),
    location: sessionData.location || "",
    duration: sessionData.duration_minutes || 30,
    highlights: sessionData.highlights || "",
    gameName: sessionData.game_name || ""
  });

  const [players, setPlayers] = useState<Player[]>(sessionData.players || []);
  const [originalPlayers, setOriginalPlayers] = useState<Player[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setFormData({
      date: new Date(sessionData.date),
      location: sessionData.location || "",
      duration: sessionData.duration_minutes || 30,
      highlights: sessionData.highlights || "",
      gameName: sessionData.game_name || ""
    });
    setPlayers(sessionData.players || []);
  // Deep copy to track original player names for change detection
  setOriginalPlayers(JSON.parse(JSON.stringify(sessionData.players || [])));
  }, [sessionData]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const adjustDuration = (increment: number) => {
    setFormData(prev => ({
      ...prev,
      duration: Math.max(15, prev.duration + increment)
    }));
  };

  const updatePlayer = (index: number, field: keyof Player, value: any) => {
    setPlayers(prev => prev.map((player, i) => 
      i === index ? { ...player, [field]: value } : player
    ));
  };

  const toggleWinner = (index: number) => {
    setPlayers(prev => prev.map((player, i) => ({
      ...player,
      is_winner: i === index ? !player.is_winner : false
    })));
  };

  // No-op detection: check if any changes were made
  const hasChanges = useMemo(() => {
    // Check form data changes
    const formChanged = 
      formData.date.toLocaleDateString('en-CA') !== sessionData.date ||
      (formData.location || '') !== (sessionData.location || '') ||
      formData.duration !== (sessionData.duration_minutes || 30) ||
      (formData.highlights || '') !== (sessionData.highlights || '') ||
      formData.gameName !== (sessionData.game_name || '');

    // Check player changes
    const playersChanged = players.some((player, index) => {
      const originalPlayer = originalPlayers[index];
      return !originalPlayer ||
        player.name !== originalPlayer.name ||
        player.score !== originalPlayer.score ||
        player.is_winner !== originalPlayer.is_winner;
    });

    return formChanged || playersChanged;
  }, [formData, players, originalPlayers, sessionData]);

  const retag = async (playerIndex: number, newName: string) => {
    if (!newName.trim()) return;
    
    // Update local state only - actual saving happens in handleSave
    updatePlayer(playerIndex, 'name', newName.trim());
    toast({ title: "Player name updated locally. Save to persist changes." });
  };

  const handleSave = async () => {
    // Single-flight guard: prevent concurrent saves
    if (isSaving) return;
    
    // Early no-op detection
    if (!hasChanges) {
      toast({ title: "No changes to save" });
      return;
    }

    try {
      setIsSaving(true);  // Lock the entire pipeline

      // Update session meta data
      const payload = {
        date: formData.date.toLocaleDateString('en-CA'),
        // normalize optional text fields: "" -> null
        location:
          typeof formData.location === 'string' && formData.location.trim() === ''
            ? null
            : formData.location,
        duration_minutes: formData.duration,
        highlights:
          typeof formData.highlights === 'string' && formData.highlights.trim() === ''
            ? null
            : formData.highlights,
      };

      const { error: sessionError } = await supabase
        .from('sessions')
        .update(payload)
        .eq('id', sessionData.session_id);

      if (sessionError) throw sessionError;

      // Handle game name changes via RPC
      const trimmedGameName = formData.gameName.trim();
      const originalGameName = sessionData.game_name.trim();
      
      if (trimmedGameName !== originalGameName) {
        // Game name validation
        if (trimmedGameName.length === 0) {
          toast({
            title: "Invalid game name",
            description: "Game names cannot be blank or whitespace only.",
            variant: "destructive"
          });
          return;
        }
        
        if (trimmedGameName.length < 2) {
          toast({
            title: "Game name too short",
            description: "Game names must be at least 2 characters long.",
            variant: "destructive"
          });
          return;
        }
        
        // Call RPC to handle game retagging
        try {
          const { error: gameRpcError } = await (supabase as any).rpc('session_retag_game', {
            p_session_id: sessionData.session_id,
            p_new_game_name: trimmedGameName
          });
          
          if (gameRpcError) throw gameRpcError;
          
          toast({ 
            title: `Game renamed to "${trimmedGameName}"`,
            description: "Game name updated successfully"
          });
        } catch (gameError: any) {
          toast({ 
            title: "Failed to rename game", 
            description: gameError.message,
            variant: "destructive" 
          });
          throw gameError; // Stop the save process
        }
      }

      // Handle player name changes via RPC before updating scores
      const updatedPlayers = [...players];
      
      // CRITICAL VALIDATION: Check for blank names and duplicates before RPC calls
      for (const player of updatedPlayers) {
        const currentName = player.name.trim();  // Use canonical 'name' field
        if (currentName.length === 0) {
          toast({
            title: "Invalid player name",
            description: "Player names cannot be blank or whitespace only.",
            variant: "destructive"
          });
          return; // Block the save operation
        }
      }
      
      // Check for duplicate names within the session (case-insensitive)
      const normalizedNames = updatedPlayers.map(p => p.name.trim().toLowerCase());  // Use canonical 'name' field
      const duplicates = normalizedNames.filter((name, i, arr) => arr.indexOf(name) !== i);
      
      if (duplicates.length > 0) {
        toast({
          title: "Duplicate player names",
          description: "Each player in a session must have a unique name.",
          variant: "destructive"
        });
        return; // Block the save operation
      }
      
      for (let i = 0; i < updatedPlayers.length; i++) {
        const currentPlayer = updatedPlayers[i];
        const originalPlayer = originalPlayers.find(p => p.player_id === currentPlayer.player_id);
        
        if (originalPlayer) {
          const currentName = currentPlayer.name.trim();  // Use canonical 'name' field
          const originalName = originalPlayer.name.trim();  // Use canonical 'name' field
          
          // If name has changed, call RPC to handle player retagging
          if (currentName !== originalName && currentName.length > 0) {
            try {
              const rpcResult = await (supabase as any).rpc('session_retag_player', {
                p_session_id: sessionData.session_id,
                p_old_player_id: currentPlayer.player_id,
                p_new_player_name: currentName
              });
              
              const { data: newPlayerId, error: rpcError } = rpcResult;

              if (rpcError) throw rpcError;
              
              if (!newPlayerId) throw new Error("Player relink failed: No ID returned");

              // Update the player_id in our local state for subsequent score updates
              updatedPlayers[i].player_id = newPlayerId;
              
              toast({ 
                title: `Player renamed to ${currentName}`,
                description: "Player identity updated successfully"
              });
            } catch (rpcError: any) {
              toast({ 
                title: "Failed to rename player", 
                description: rpcError.message,
                variant: "destructive" 
              });
              throw rpcError; // Stop the save process
            }
          }
        }
      }

      // Update scores using potentially updated player_ids
      for (const player of updatedPlayers) {
        const { error: scoreError } = await supabase
          .from('scores')
          .update({
            score: player.score,
            is_winner: player.is_winner
          })
          .eq('id', player.score_id);

        if (scoreError) throw scoreError;
      }

      // Invalidate relevant caches based on what changed
      const oldGameId = sessionData.game_name !== formData.gameName ? 'unknown' : undefined;
      const newGameId = formData.gameName !== sessionData.game_name ? 'unknown' : undefined;
      
      await invalidateSessionData('scoreUpdate', {
        playerId: player?.id || '',
        gameId: sessionData.session_id, // Use session_id as fallback
        oldGameId,
        newGameId,
        date: formData.date.toLocaleDateString('en-CA')
      });

      toast({ title: "Session updated successfully" });
      onSessionUpdated();
      onClose();
    } catch (error: any) {
      toast({ 
        title: "Error updating session", 
        description: error.message,
        variant: "destructive" 
      });
    } finally {
      setIsSaving(false);  // Always reset the lock in finally
    }
  };

  const isDeleted = !!sessionData.deleted_at;

  return (
    <Dialog open={isOpen} onOpenChange={isSaving ? undefined : onClose}>  // Prevent close during save
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold">
              Edit Session {isDeleted && <Badge variant="destructive" className="ml-2">Deleted</Badge>}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
          {/* Game Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-900">Game Information</h3>
            <div className="space-y-2">
              <Label htmlFor="gameName">Game Name</Label>
              <Input
                id="gameName"
                value={formData.gameName}
                onChange={(e) => setFormData(prev => ({ ...prev, gameName: e.target.value }))}
                disabled={isDeleted || isSaving}  // Disable during save
              />
            </div>
          </div>

          <Separator />

          {/* Session Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-900">Session Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left" disabled={isDeleted || isSaving}>  // Disable during save
                      {formData.date.toLocaleDateString()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => {
                        if (date) {
                          setFormData(prev => ({ ...prev, date }));
                          setShowCalendar(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustDuration(-15)}
                    disabled={isDeleted || isSaving}  // Disable during save
                  >
                    -15m
                  </Button>
                  <span className="text-sm font-medium min-w-[60px] text-center">
                    {formatDuration(formData.duration)}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustDuration(15)}
                    disabled={isDeleted || isSaving}  // Disable during save
                  >
                    +15m
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                disabled={isDeleted || isSaving}  // Disable during save
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights</Label>
              <Textarea
                id="highlights"
                value={formData.highlights}
                onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
                rows={3}
                disabled={isDeleted || isSaving}  // Disable during save
              />
            </div>
          </div>

          <Separator />

          {/* Players & Scores */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-gray-900">Players & Scores</h3>
            <div className="space-y-3">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWinner(index)}
                    className={`p-1 ${player.is_winner ? 'text-yellow-500' : 'text-gray-400'}`}
                    disabled={isDeleted || isSaving}  // Disable during save
                  >
                    <Crown className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <Input
                      value={player.name}  // Use canonical 'name' field
                      onChange={(e) => updatePlayer(index, 'name', e.target.value)}  // Update 'name' field
                      onBlur={(e) => {
                        if (e.target.value !== player.name) {  // Use canonical 'name' field
                          retag(index, e.target.value);
                        }
                      }}
                      disabled={isDeleted || isSaving}  // Disable during save
                    />
                    <Input
                      type="number"
                      value={player.score}
                      onChange={(e) => updatePlayer(index, 'score', parseInt(e.target.value) || 0)}
                      disabled={isDeleted || isSaving}  // Disable during save
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 flex justify-end pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isSaving}>  // Disable close during save
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || isDeleted || !hasChanges}  // Comprehensive disable logic
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};