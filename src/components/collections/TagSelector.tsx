
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { useAvailableTagsGrouped, GroupedTags } from '@/hooks/useAvailableTagsGrouped';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagSelector = ({ selectedTags, onTagsChange }: TagSelectorProps) => {
  const [customTag, setCustomTag] = useState('');
  const { data: groupedTags = {} } = useAvailableTagsGrouped();

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

  const formatTypeLabel = (type: string) => {
    return type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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

      {/* Grouped Tags Accordion */}
      {Object.keys(groupedTags).length > 0 && (
        <div className="border rounded-lg">
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedTags).map(([type, tags]) => (
              <AccordionItem key={type} value={type} className="border-none">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <span className="font-medium">{formatTypeLabel(type)}</span>
                  <span className="text-sm text-gray-500 ml-2">({tags.length})</span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {tags.map(tag => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tag.id}
                          checked={selectedTags.includes(tag.name)}
                          onCheckedChange={() => handleTagToggle(tag.name)}
                        />
                        <Label 
                          htmlFor={tag.id} 
                          className="text-sm cursor-pointer flex-1 leading-tight"
                        >
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

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
