import { useQuery } from "react-query";
import fetch from "isomorphic-unfetch";

export const useMovieScore = (data) => {
  const scores = useQuery(
    ["movie", "scores", data?.id],
    async () => {
      const resp = await fetch(
        `/api/getScores?title=${data?.title}&imdbId=${data?.imdb_id}`
      );
      const json = await resp.json();
      return json;
    },
    {
      staleTime: 10000 * 60 * 60,
      enabled: data !== undefined && data?.imdb_id !== undefined,
      retry: false,
    }
  );
  return scores;
};
