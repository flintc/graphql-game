import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useMovieCredits = (movieId) => {
  const movieCredits = useQuery(
    ["movie", "credits", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/" + "movie" + "/" + movieId + "/credits");
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return movieCredits;
};
