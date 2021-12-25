import { useQuery } from "react-query";
import { client } from "./queryClient";

import { useMovie } from "./useMovie";
import { useQueryClient } from "react-query";

export const useMediaWatchProviders = (movieId, mediaType = "movie") => {
  const queryClient = useQueryClient();
  useMovie;
  const foo = useMovie(movieId, {
    options: { select: (data) => data?.["watch/providers"]?.results?.["US"] },
  });

  const movieWatchProviders = useQuery(
    [mediaType, "watchProviders", String(movieId)],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get(
        "/" + "movie" + "/" + movieId + "/watch/providers"
      );
      return resp.data;
      // }
    },
    {
      // staleTime: 1 * 24 * 60 * 60 * 1000,
      staleTime: 0,
      enabled: movieId !== undefined && !foo.data && foo.status === "success",
      select: (data) => data.results.US,
    }
  );
  return foo.data && foo.status === "success" ? foo : movieWatchProviders;
};
