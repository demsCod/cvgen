import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { listTemplates } from '../lib/api';
import { TemplateDefinition } from './types';

interface UseTemplatesOptions {
  enabled?: boolean;
  queryOptions?: Partial<UseQueryOptions<TemplateDefinition[], Error>>;
}

export function useTemplates(options: UseTemplatesOptions = {}) {
  const { enabled = true, queryOptions } = options;

  return useQuery<TemplateDefinition[], Error>({
    queryKey: ['templates'],
    queryFn: async () => {
      const manifest = await listTemplates();
      return manifest.templates;
    },
    staleTime: 1000 * 60 * 10,
    enabled,
    ...queryOptions,
  });
}
