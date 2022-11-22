import axios from "axios";
import { useQuery } from "react-query";

export const useMovieCredits = (movieId) => {
  const movieCredits = useQuery(
    ["movie", "credits", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await axios.get(
        "/api/tmdb" + "/" + "movie" + "/" + movieId + "/credits"
      );
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return movieCredits;
};
