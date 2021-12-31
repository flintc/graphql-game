import axios from "axios";
import _ from "lodash";
import { useEffect } from "react";
import { useTrackVisibility } from "react-intersection-observer-hook";
import { useInfiniteQuery } from "react-query";

export const useMovieBrowse = (params) => {
  const [bottomRef, { isVisible: isBottomVisible }] = useTrackVisibility({});
  const result = useInfiniteQuery({
    queryKey: [
      "movies",
      "keyword",
      {
        include_adult: false,
        with_original_language: "en",
        sort_by: "vote_count.desc",
        "vote_count.gte": 10,
        ...params,
      },
    ],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, , queryKeyParams] = queryKey;
      const resp = await axios.get("/api/tmdb/discover/movie", {
        params: {
          ...queryKeyParams,
          page: pageParam,
        },
      });
      return resp.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.total_pages === lastPage.page ? null : lastPage.page + 1;
    },
    staleTime: 10000 * 60 * 1000,
    keepPreviousData: true,
  });
  const { hasNextPage, isFetchingNextPage, isFetching, fetchNextPage } = result;

  const fetchNextPageThrottled = _.throttle(fetchNextPage, 500, {
    leading: false,
  });
  useEffect(() => {
    if (isBottomVisible && hasNextPage && !isFetchingNextPage && !isFetching) {
      fetchNextPageThrottled();
    }
    return () => {
      fetchNextPageThrottled.cancel();
    };
  }, [
    isBottomVisible,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    fetchNextPageThrottled,
  ]);

  return {
    ...result,
    bottomRef,
    isBottomVisible,
  };
};
