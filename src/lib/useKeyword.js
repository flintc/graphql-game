import { useQuery } from "react-query";
import { client } from "./queryClient";

export const useKeyword = (keywordId) => {
  const out = useQuery(
    ["keyword", keywordId],
    async ({ queryKey }) => {
      const [, keywordId] = queryKey;
      const resp = await client.get("/keyword/" + keywordId);
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 60 * 24 * 7,
      enabled: keywordId !== undefined,
    }
  );
  return out;
};
