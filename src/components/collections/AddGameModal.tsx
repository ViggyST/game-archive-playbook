
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePlayerCollections } from "@/hooks/usePlayerCollections";

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'owned' | 'wishlist';
}

const AddGameModal = ({ isOpen, onClose, defaultType = 'owned' }: AddGameModalProps) => {
  const [gameName, setGameName] = useState("");
  const [complexity, setComplexity] = useState<string>("");
  const [collectionType, setCollectionType] = useState<'owned' | 'wishlist'>(defaultType);
  const [rulebookUrl, setRulebookUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const { addToCollection, isAddingToCollection } = usePlayerCollections();

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!gameName.trim()) return;

    addToCollection({
      gameName: gameName.trim(),
      collectionType,
      complexity: complexity || undefined,
      tags: tags.length > 0 ? tags : undefined,
      rulebookUrl: rulebookUrl.trim() || undefined,
      notes: notes.trim() || undefined
    });

    // Reset form
    setGameName("");
    setComplexity("");
    setRulebookUrl("");
    setNotes("");
    setTags([]);
    setNewTag("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-poppins font-bold text-xl">
            Add Game to Collection
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Game Name */}
          <div className="space-y-2">
            <Label htmlFor="gameName" className="font-inter font-medium">
              Game Name *
            </Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name..."
              className="font-inter"
            />
          </div>

          {/* Collection Type */}
          <div className="space-y-3">
            <Label className="font-inter font-medium">Add to</Label>
            <RadioGroup 
              value={collectionType} 
              onValueChange={(value: 'owned' | 'wishlist') => setCollectionType(value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="owned" id="owned" />
                <Label htmlFor="owned" className="font-inter text-sm cursor-pointer">
                  🎮 Owned Games
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wishlist" id="wishlist" />
                <Label htmlFor="wishlist" className="font-inter text-sm cursor-pointer">
                  📝 Wishlist
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Complexity */}
          <div className="space-y-3">
            <Label className="font-inter font-medium">Complexity (Optional)</Label>
            <RadioGroup 
              value={complexity} 
              onValueChange={setComplexity}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Light" id="light" />
                <Label htmlFor="light" className="font-inter text-sm cursor-pointer">
                  Light
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Medium" id="medium" />
                <Label htmlFor="medium" className="font-inter text-sm cursor-pointer">
                  Medium
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Heavy" id="heavy" />
                <Label htmlFor="heavy" className="font-inter text-sm cursor-pointer">
                  Heavy
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="font-inter font-medium">Tags (Optional)</Label>
            
            {/* Tag Input */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add tag..."
                className="font-inter flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                size="sm"
                variant="outline"
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tag List */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className="font-inter text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Rulebook URL */}
          <div className="space-y-2">
            <Label htmlFor="rulebookUrl" className="font-inter font-medium">
              Rulebook URL (Optional)
            </Label>
            <Input
              id="rulebookUrl"
              value={rulebookUrl}
              onChange={(e) => setRulebookUrl(e.target.value)}
              placeholder="https://..."
              className="font-inter"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="font-inter font-medium">
              Notes (Optional)
            </Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Personal notes..."
              className="font-inter"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 font-inter"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!gameName.trim() || isAddingToCollection}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-inter"
            >
              {isAddingToCollection ? "Adding..." : "Add Game"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGameModal;
