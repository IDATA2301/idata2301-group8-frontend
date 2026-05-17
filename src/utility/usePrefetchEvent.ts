import { useQueryClient } from "@tanstack/react-query";
import { getGetEventBySlugQueryOptions } from "@api/events";

export function usePrefetchEvent() {
  const queryClient = useQueryClient();

  const prefetch = (slug: string) => {
    if (!slug) return;

    const queryOptions = getGetEventBySlugQueryOptions(slug);
    queryClient.prefetchQuery(queryOptions);
  };

  return { prefetch };
}
