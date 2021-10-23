import React, { useState, useEffect } from "react";
import { client, discoverMovies, getGeneres, getKeywords } from "./queryClient";
import { useQueryParams } from "./useQueryParams";
import _ from "lodash";
import { useRouter } from "next/router";
import { useQuery, useInfiniteQuery } from "react-query";
import { useTrackVisibility } from "react-intersection-observer-hook";

export const useMovieBrowse = (params) => {
  // const queryParams = useQueryParams();
  // const router = useRouter();

  // const genres = useQuery("genres", getGeneres, {
  //   staleTime: 1000 * 60 * 60,
  // });

  const [bottomRef, { isVisible: isBottomVisible }] = useTrackVisibility({});
  const result = useInfiniteQuery({
    queryKey: [
      "movies",
      "keyword",
      {
        include_adult: false,
        with_original_language: "en",
        // with_keywords: `${router.query.id}`,
        // sort_by: "popularity.desc",
        sort_by: "vote_count.desc",
        "vote_count.gte": 10,
        // with_release_type: 3, // 3 = release
        // "primary_release_date.gte": "2000-01-01",
        // "primary_release_date.lte": "2009-12-31", // primary_release_year: "2020",
        ...params,
      },
    ],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, , queryKeyParams] = queryKey;
      const resp = await client.get(`/discover/movie`, {
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
  });
  const { hasNextPage, isFetchingNextPage, isFetching, fetchNextPage } = result;
  // const { data } = useQuery(
  //   ["browse", "movies", { without_genres: queryParams?.without_genres }],
  //   discoverMovies,
  //   {
  //     staleTime: 1000 * 60 * 1000,
  //     // keepPreviousData: true,
  //     // placeholderData: initialData,
  //     // enabled: queryP
  //   }
  // );
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
    // toggles: genres.data
    //   ? genres.data.genres.map((genre) => {
    //       return {
    //         defaultChecked: true,
    //         label: genre.name,
    //         value: genre.id,
    //         onChange: (e) => {
    //           const currentGenres = new Set(
    //             (router.query.without_genres || "").split(",")
    //           );
    //           currentGenres.delete("");
    //           if (!e.target.checked) {
    //             currentGenres.add(String(e.target.value));
    //           } else {
    //             currentGenres.delete(String(e.target.value));
    //           }
    //           router.push({
    //             pathname: router.pathname,
    //             query: {
    //               ...router.query,
    //               without_genres: Array.from(currentGenres).join(","),
    //             },
    //           });
    //         },
    //       };
    //     })
    //   : [],
  };
};
