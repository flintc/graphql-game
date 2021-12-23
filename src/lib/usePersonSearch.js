import { useQuery, useInfiniteQuery } from "react-query";
import { client } from "./queryClient";

export const usePersonSearch = (query) => {
  const resp = useQuery(
    ["search", "person", query],
    async ({ queryKey, pageParam }) => {
      const [, , query] = queryKey;
      const resp = await client.get("/search/person", {
        params: {
          query: query,
          include_adult: false,
          // page: pageParam,
        },
      });
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: query !== undefined,
      // getNextPageParam: (lastPage, pages) => {
      //   return lastPage.total_pages === lastPage.page
      //     ? null
      //     : lastPage.page + 1;
      // },
      keepPreviousData: true,
    }
  );
  return resp;
};
