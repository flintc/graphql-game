import axios from "axios";
import _ from "lodash";
import { useQuery } from "react-query";
import { useMovie } from "./useMovie";

const select = (data) => {
  const buyOrRent = _.intersectionBy(
    data.results.US.buy,
    data.results.US.rent,
    "provider_id"
  );
  return {
    ...data.results.US,
    buy: _.differenceBy(data.results.US.buy, buyOrRent, "provider_id"),
    rent: _.differenceBy(data.results.US.rent, buyOrRent, "provider_id"),
    buyOrRent,
  };
};

export const useMediaWatchProviders = (movieId, mediaType = "movie") => {
  const foo = useMovie(movieId, {
    options: {
      select: (fullData) => {
        const data = fullData?.["watch/providers"];
        if (!data) {
          return undefined;
        }
        return select(data);
      },
    },
  });

  const movieWatchProviders = useQuery(
    [mediaType, "watchProviders", String(movieId)],
    async ({ queryKey }) => {
      const [, , movieId] = queryKey;
      const resp = await axios.get(
        "/api/tmdb" + "/" + "movie" + "/" + movieId + "/watch/providers"
      );
      return resp.data;
    },
    {
      staleTime: 1 * 24 * 60 * 60 * 1000,
      enabled: movieId !== undefined && !foo.data && foo.status === "success",
      select,
    }
  );
  return foo.data && foo.status === "success" ? foo : movieWatchProviders;
};
