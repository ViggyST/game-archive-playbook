
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

      // Group tags by type
      const grouped = (data || []).reduce((acc, tag) => {
        const type = tag.tag_type || 'Other';
        if (!acc[type]) acc[type] = [];
        acc[type].push(tag);
        return acc;
      }, {} as GroupedTags);

      return grouped;
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};
