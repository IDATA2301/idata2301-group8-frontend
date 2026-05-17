import { useQueryClient } from "@tanstack/react-query";
import { getGetEventsQueryOptions, type GetEventsParams } from "@api/events";

const EVENTS_PER_PAGE = 15;

export function usePrefetchSearch() {
  const queryClient = useQueryClient();

  const prefetch = (params: GetEventsParams = {}) => {
    const queryParams: GetEventsParams = {
      page: 0,
      size: EVENTS_PER_PAGE,
      ...params
    };

    const queryOptions = getGetEventsQueryOptions(queryParams);

    queryClient.prefetchQuery(queryOptions);
  };

  return { prefetch };
}
