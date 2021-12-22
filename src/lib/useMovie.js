import { useQuery, useQueryClient } from "react-query";
import { client } from "./queryClient";

export const useMovie = (movieId) => {
  const queryClient = useQueryClient();
  const cachedResp = queryClient.getQueryData(["movie", "details", movieId]);
  if (!cachedResp?.imdb_id) {
    queryClient.invalidateQueries(["movie", "details", movieId]);
  }
  const movieDetails = useQuery(
    ["movie", "details", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/movie/" + movieId, {
        params: {
          append_to_response: "videos,images,keywords,credits,watch/providers",
        },
      });
      return resp.data;
    },
    {
      staleTime: 1 * 24 * 60 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return movieDetails;
};
