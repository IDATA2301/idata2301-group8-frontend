import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetEventsQueryOptions, type GetEventsParams } from "@api/events";

const EVENTS_PER_PAGE = 15;

export function usePrefetchSearch() {
  const queryClient = useQueryClient();
  const currentTime = useMemo(() => new Date().toISOString(), []);

  const prefetch = (params: GetEventsParams = { filter: {} }) => {
    const queryParams: GetEventsParams = {
      page: 0,
      size: EVENTS_PER_PAGE,
      ...params,
      filter: {
        startDate: currentTime,
        ...params.filter
      }
    };

    const queryOptions = getGetEventsQueryOptions(queryParams);

    queryClient.prefetchQuery(queryOptions);
  };

  return { prefetch };
}
