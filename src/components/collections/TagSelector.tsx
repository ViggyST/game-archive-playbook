
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useAvailableTagsGrouped } from '@/hooks/useAvailableTagsGrouped';

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onTagsChange }) => {
  const { data: groupedTags = {}, isLoading } = useAvailableTagsGrouped();

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

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Tags</label>
      
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          {selectedTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="flex items-center gap-1 bg-orange-100 text-orange-700 border-orange-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="hover:bg-orange-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Tag Selection Accordion */}
      <div className="border rounded-lg">
        <Accordion type="multiple" className="w-full">
          {Object.entries(groupedTags).map(([type, tags]) => (
            <AccordionItem key={type} value={type} className="border-b-0">
              <AccordionTrigger className="hover:no-underline px-4 py-3">
                <span className="capitalize font-medium">
                  {type.replace(/[_-]/g, ' ')} ({tags.length})
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={tag.id}
                        checked={selectedTags.includes(tag.name)}
                        onCheckedChange={() => handleToggle(tag.name)}
                      />
                      <label
                        htmlFor={tag.id}
                        className="text-sm cursor-pointer hover:text-gray-900"
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

      {Object.keys(groupedTags).length === 0 && (
        <div className="text-sm text-gray-500 py-4 text-center">
          No tags available
        </div>
      )}
    </div>
  );
};
