import { useQuery } from "react-query";
import fetch from "isomorphic-unfetch";
import _ from "lodash";

export const useMovieScore = (data) => {
  const scores = useQuery(
    ["movie", "scores", data?.id],
    async () => {
      var url = new URL("http://example.com/api/getScore"),
        params = { title: data?.title, imdbId: data?.imdb_id };
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
      const resp = await fetch(`/api/getScores${url.search}`);
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
