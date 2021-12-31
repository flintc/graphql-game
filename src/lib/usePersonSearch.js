import axios from "axios";
import { useQuery } from "react-query";

export const usePersonSearch = (query) => {
  const resp = useQuery(
    ["search", "person", query],
    async ({ queryKey }) => {
      const [, , query] = queryKey;
      const resp = await axios.get("/api/tmdb" + "/search/person", {
        params: {
          query: query,
          include_adult: false,
        },
      });
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: query !== undefined && query?.length > 0,
      keepPreviousData: true,
    }
  );
  return resp;
};
