import { useQuery } from "react-query";
import { client } from "./queryClient";
import { useQueryClient } from "react-query";

export const useWatchProviders = (movieId) => {
  const queryClient = useQueryClient();
  const movieWatchProviders = useQuery(
    ["movie", "watchProviders", String(movieId)],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const cachedData = queryClient.getQueryData([
        "movie",
        "details",
        String(movieId),
      ]);
      if (cachedData["watch/providers"]) {
        return { id: parseInt(movieId), ...cachedData["watch/providers"] };
      } else {
        const resp = await client.get(
          "/" + "movie" + "/" + movieId + "/watch/providers"
        );
        return resp.data;
      }
    },
    {
      staleTime: 1 * 24 * 60 * 60 * 1000,
      enabled: movieId !== undefined,
      select: (data) => data.results.US,
    }
  );
  return movieWatchProviders;
};
