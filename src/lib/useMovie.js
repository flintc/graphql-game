import { useQuery, useQueryClient } from "react-query";
import { client } from "./queryClient";

export const useMovie = (movieId) => {
  const queryClient = useQueryClient();
  const foo = queryClient.getQueryData(["movie", "details", movieId]);
  const movieDetails = useQuery(
    ["movie", "details", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/movie/" + movieId);
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  const movieKeywords = useQuery(
    ["movie", "keywords", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/movie/" + movieId + "/keywords");
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return movieDetails;
};
