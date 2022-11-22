import axios from "axios";
import { useQuery, useQueryClient } from "react-query";

export const useMovie = (movieId, config) => {
  const queryClient = useQueryClient();
  const cachedResp = queryClient.getQueryData(["movie", "details", movieId]);
  if (!cachedResp?.imdb_id) {
    queryClient.invalidateQueries(["movie", "details", movieId]);
  }
  const movieDetails = useQuery(
    ["movie", "details", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await axios.get("/api/tmdb" + "/movie/" + movieId, {
        params: {
          append_to_response: "videos,images,keywords,credits,watch/providers",
        },
      });
      queryClient.invalidateQueries(["movie", "watchProviders", movieId]);
      return resp.data;
    },
    {
      staleTime: 1 * 24 * 60 * 60 * 1000,
      enabled: movieId !== undefined && movieId !== null,
      ...config?.options,
    }
  );
  return movieDetails;
};
