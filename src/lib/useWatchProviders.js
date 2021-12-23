import { useQuery } from "react-query";
import { client } from "./queryClient";
import _ from "lodash";

export const useWatchProviders = (mediaType = "movie") => {
  const movieWatchProviders = useQuery(
    [mediaType, "watchProviders"],
    async () => {
      const resp = await client.get("/watch/providers/" + mediaType, {
        params: {
          watch_region: "US",
        },
      });
      return resp.data;
    },
    {
      staleTime: 1 * 24 * 60 * 60 * 1000,
      select: (data) => data.results,
    }
  );
  return movieWatchProviders;
};
