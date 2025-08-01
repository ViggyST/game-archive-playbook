
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  name: string;
  tag_type: string;
}

export interface GroupedTags {
  [key: string]: Tag[];
}

export const useAvailableTagsGrouped = () => {
  return useQuery({
    queryKey: ['available-tags-grouped'],
    queryFn: async (): Promise<GroupedTags> => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name, tag_type')
        .order('tag_type', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching tags:', error);
        return {};
      }

      // Filter out unwanted tags and group by type
      const filteredData = (data || []).filter(tag => 
        !['component', 'experience', 'structure'].includes(tag.name.toLowerCase())
      );

      const grouped = filteredData.reduce((acc, tag) => {
        const type = tag.tag_type || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(tag);
        return acc;
      }, {} as GroupedTags);

      return grouped;
    },
    staleTime: 0, // Force refresh
    gcTime: 0, // Don't cache
  });
};
