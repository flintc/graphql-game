import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useMovieReviews = (movieId) => {
  const personCredits = useQuery(
    ["movie", "reviews", movieId],
    async ({ queryKey }) => {
      const [, , personId] = queryKey;
      const resp = await client.get("/movie/" + movieId + "/reviews", {
        params: {
          page: 2,
        },
      });
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return personCredits;
};
