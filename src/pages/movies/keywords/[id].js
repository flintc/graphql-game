import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useInfiniteQuery } from "react-query";
import { client, discoverMovies } from "../../../lib/queryClient";
import { useTrackVisibility } from "react-intersection-observer-hook";
import _ from "lodash";
import { useEffect } from "react";
import { motion } from "framer-motion";
export default function MoviesKeyword() {
  const router = useRouter();
  const [bottomRef, { isVisible: isBottomVisible }] = useTrackVisibility({});
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [
      "movies",
      "keyword",
      {
        include_adult: false,
        with_original_language: "en",
        // with_keywords: `${router.query.id}`,
        // sort_by: "popularity.desc",
        sort_by: "vote_count.desc",
        "vote_count.gte": 100,
        with_release_type: 3, // 3 = release
        "primary_release_date.gte": "2000-01-01",
        "primary_release_date.lte": "2009-12-31", // primary_release_year: "2020",
      },
    ],
    queryFn: async ({ queryKey, pageParam }) => {
      const [, , params] = queryKey;
      const resp = await client.get(`/discover/movie`, {
        params: {
          ...params,
          page: pageParam,
        },
      });
      return resp.data;
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.total_pages === lastPage.page ? null : lastPage.page + 1;
    },
    staleTime: 0,
  });

  // const { data, status } = useQuery(
  //   ["movies", "keyword", { with_keywords: `${router.query.id}` }],
  //   async () => {
  //     const resp = await client.get(`/keyword/${router.query.id}/movies`);
  //     return resp.data;
  //   },
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

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error: {data.error}</p>;
  }
  return (
    <div>
      <h1>{router.query.id}</h1>
      <ul>
        {data.pages
          .map((x) => x.results)
          .flat()
          .map((movie) => (
            <li key={movie.id}>
              <Link
                href={{ pathname: `/movies/[id]`, query: { id: movie.id } }}
              >
                <a className="text-gray-12">
                  <div className="relative mx-4 my-2 overflow-x-hidden rounded-lg ">
                    <div
                      style={
                        {
                          // backgroundColor: `var(--blackA11)`,
                        }
                      }
                      className="absolute bottom-0 left-0 w-full px-4 pt-16 pb-6 text-2xl bg-gradient-to-t from-black/90 via-black/70 to-black/0"
                    >
                      {movie.title}
                      {` `}
                      {movie.release_date && (
                        <span className="text-xl whitespace-nowrap">
                          ( {movie?.release_date?.split("-")?.[0]} )
                        </span>
                      )}
                    </div>
                    <motion.img
                      layout
                      layoutId={`movie-backdrop-${movie.id}`}
                      src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    />
                  </div>
                </a>
              </Link>
            </li>
          ))}
      </ul>
      {hasNextPage ? (
        <button
          ref={bottomRef}
          className="-translate-y-12"
          onClick={() => {
            fetchNextPage();
          }}
        >
          fetch more
        </button>
      ) : (
        <div className="text-gray-11">Nothing more to see</div>
      )}
    </div>
  );
}
