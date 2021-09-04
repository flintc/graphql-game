import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useTv = (movieId) => {
  const movieDetails = useQuery(
    ["tv", "details", movieId],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await client.get("/tv/" + movieId);
      const resp2 = await client.get("/tv/" + movieId + "/external_ids");
      return { ...resp.data, imdb_id: resp2.data?.imdb_id };
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: movieId !== undefined,
    }
  );
  return movieDetails;
};
