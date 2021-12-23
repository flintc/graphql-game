import { useQuery } from "react-query";
import { client } from "./queryClient";
import _ from "lodash";

const streamingIds = [
  8, 9, 337, 257, 15, 531, 384, 386, 350, 300, 11, 15, 387, 332,
];

const rentOrBuyIds = [2, 3, 7, 10, 192];

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
      select: (data) => ({
        flatrate: data.results.filter((x) => {
          return streamingIds.includes(x.provider_id);
        }),
        rentOrBuy: data.results.filter((x) => {
          return rentOrBuyIds.includes(x.provider_id);
        }),
      }),
    }
  );
  return movieWatchProviders;
};
