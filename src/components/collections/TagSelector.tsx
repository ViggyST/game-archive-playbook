
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAvailableTags, Tag } from '@/hooks/useAvailableTags';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagSelector = ({ selectedTags, onTagsChange }: TagSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [customTag, setCustomTag] = useState('');
  const { data: availableTags = [] } = useAvailableTags();

  const handleTagToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onTagsChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1 px-2 py-1">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Selector */}
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between"
            >
              Select tags...
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandList>
                <CommandEmpty>No tags found.</CommandEmpty>
                <CommandGroup>
                  {availableTags.map((tag) => (
                    <CommandItem
                      key={tag.id}
                      onSelect={() => handleTagToggle(tag.name)}
                      className="flex items-center gap-2"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4",
                          selectedTags.includes(tag.name) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {tag.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Custom Tag Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom tag..."
          value={customTag}
          onChange={(e) => setCustomTag(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCustomTag();
            }
          }}
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddCustomTag} 
          variant="outline"
          size="sm"
          disabled={!customTag.trim()}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
