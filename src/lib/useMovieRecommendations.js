import axios from "axios";
import { useQuery } from "react-query";

export const useMovieRecommendations = (movieId) => {
  const movieSimilar = useQuery(
    ["movie", "similar", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const respPage1 = await axios.get(
        "/api/tmdb" + "/" + "movie" + "/" + movieId + "/recommendations"
      );
      const respPage2 = await axios.get(
        "/api/tmdb" + "/" + "movie" + "/" + movieId + "/recommendations",
        { params: { page: 2 } }
      );

      return {
        ...respPage1.data,
        results: [
          ...respPage1.data.results,
          ...respPage2.data.results.slice(1),
        ],
      };
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
      select: (data) => {
        return {
          ...data,
          results: data.results.filter((x) => x.vote_count > 750),
        };
        // .map((x) => x.title);
      },
    }
  );
  return movieSimilar;
};
