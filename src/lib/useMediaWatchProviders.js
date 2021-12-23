import { useQuery } from "react-query";
import { client } from "./queryClient";
import { useQueryClient } from "react-query";

export const useMediaWatchProviders = (movieId, mediaType = "movie") => {
  const queryClient = useQueryClient();
  const movieWatchProviders = useQuery(
    [mediaType, "watchProviders", String(movieId)],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const cachedData = queryClient.getQueryData([
        mediaType,
        "details",
        String(movieId),
      ]);
      if (cachedData?.["watch/providers"]) {
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
