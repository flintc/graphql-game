import axios from "axios";
import { useQuery } from "react-query";

export const usePerson = (personId) => {
  const personDetails = useQuery(
    ["person", "details", personId],
    async ({ queryKey }) => {
      const [, , personId] = queryKey;
      const resp = await axios.get("/api/tmdb" + "/person/" + personId);
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: personId !== undefined,
    }
  );
  return personDetails;
};
