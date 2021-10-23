import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useKeywords = (movieId, media_type = "movie") => {
  const movieKeywords = useQuery(
    [media_type, "keywords", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get(
        "/" + media_type + "/" + movieId + "/keywords"
      );
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  const data = movieKeywords.data
    ? {
        ...movieKeywords.data,
        keywords: movieKeywords.data.keywords || movieKeywords.data.results,
      }
    : movieKeywords.data;

  return {
    ...movieKeywords,
    data,
  };
};
