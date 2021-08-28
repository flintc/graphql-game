import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useMovie = (movieId) => {
  const movieDetails = useQuery(
    ["movie", "details", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/movie/" + movieId);
      return resp.data;
    },
    {
      staleTime: 100 * 60 * 1000,
      enabled: movieId !== undefined,
      initialData: props,
    }
  );
  return movieDetails;
};
