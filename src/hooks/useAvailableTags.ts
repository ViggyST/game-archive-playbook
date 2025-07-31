
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Tag {
  id: string;
  name: string;
}

export const useAvailableTags = () => {
  return useQuery({
    queryKey: ['available-tags'],
    queryFn: async (): Promise<Tag[]> => {
      const { data, error } = await supabase
        .from('tags')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching tags:', error);
        return [];
      }

      return data || [];
    },
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};
