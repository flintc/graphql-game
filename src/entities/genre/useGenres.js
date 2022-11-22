import { useQuery } from "react-query";
import { getGeneres } from "../../lib/queryClient";
import _ from "lodash";

export const useGenres = () => {
  const genres = useQuery(
    ["genres"],
    async () => {
      const resp = await getGeneres();
      return resp;
    },
    {
      staleTime: 10000 * 60 * 1000,
    }
  );
  return {
    ...genres,
    data: genres?.data
      ? _.fromPairs(
          genres.data.genres.map((genre) => [Number(genre.id), genre.name])
        )
      : undefined,
  };
};
