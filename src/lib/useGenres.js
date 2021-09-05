import { useQuery } from "react-query";
import { client, getGeneres } from "./queryClient";

export const useGenres = () => {
  const genres = useQuery(
    ["genres"],
    async () => {
      const resp = await getGeneres();
      return resp.data;
    },
    {
      staleTime: 10000 * 60 * 1000,
    }
  );
  return {
    ...genres,
  };
};
