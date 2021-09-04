import { useQuery } from "react-query";
import fetch from "isomorphic-unfetch";

export const useKnownFor = (data) => {
  const scores = useQuery(
    ["person", "knownFor", data?.id],
    async () => {
      const resp = await fetch(`/api/getKnownFor?imdbId=${data?.imdb_id}`);
      const json = await resp.json();
      return json;
    },
    { staleTime: 1000 * 60 * 60, enabled: data !== undefined, retry: false }
  );
  return scores;
};
