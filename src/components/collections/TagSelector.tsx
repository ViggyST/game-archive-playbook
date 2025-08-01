
import React, { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, ChevronDown, Tags } from 'lucide-react';
import { useAvailableTagsGrouped } from '@/hooks/useAvailableTagsGrouped';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const { data: groupedTags = {}, isLoading } = useAvailableTagsGrouped();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagName));
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Tags</label>
        <div className="text-sm text-gray-500">Loading tags...</div>
      </div>
    );
  }

  const totalTags = Object.values(groupedTags).reduce((sum, tags) => sum + tags.length, 0);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Tags</label>
      
      {/* Selected Tags Display - Compact */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1 p-2 bg-orange-50 rounded-md border border-orange-200">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs px-2 py-1 bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 hover:bg-orange-300 rounded-full p-0.5"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Compact Toggle Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between text-sm h-9"
      >
        <div className="flex items-center gap-2">
          <Tags className="w-4 h-4" />
          <span>Browse Tags ({totalTags} available)</span>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </Button>

      {/* Expandable Tag Selection */}
      {isExpanded && (
        <div className="border rounded-md bg-white shadow-sm">
          <Accordion type="multiple" className="w-full">
            {Object.entries(groupedTags).map(([type, tags]) => (
              <AccordionItem key={type} value={type} className="border-b-0 last:border-b-0">
                <AccordionTrigger className="hover:no-underline px-3 py-2 text-sm">
                  <span className="capitalize font-medium text-gray-700">
                    {type.replace(/[_-]/g, ' ')} ({tags.length})
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="grid grid-cols-1 gap-1.5">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2 p-1 rounded hover:bg-gray-50">
                        <Checkbox
                          id={tag.id}
                          checked={selectedTags.includes(tag.name)}
                          onCheckedChange={() => handleToggle(tag.name)}
                        />
                        <label
                          htmlFor={tag.id}
                          className="text-sm cursor-pointer hover:text-gray-900 flex-1"
                        >
                          {tag.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}

      {totalTags === 0 && (
        <div className="text-sm text-gray-500 py-4 text-center border rounded-md bg-gray-50">
          No tags available
        </div>
      )}
    </div>
  );
};
