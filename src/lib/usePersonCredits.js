import { useQuery } from "react-query";
import { client } from "./queryClient";

const isMovie = (data) => {
  return (
    (data?.media_type === "movie" || data?.data) &&
    data.profile_path === undefined
  );
};

const isTv = (data) => {
  return (
    (data?.media_type === "tv" || data?.name) && data.profile_path === undefined
  );
};

const isPerson = (data) => {
  return data?.name && data.profile_path !== undefined;
};

const normalizeMedia = (data) => {
  if (isMovie(data)) {
    return {
      ...data,
      id: data.id,
      name: data.title,
      media_type: "movie",
    };
  } else if (isTv(data)) {
    return {
      ...data,
      id: data.id,
      title: data.name,
      media_type: "tv",
    };
  }
  return data;
};

export const usePersonCredits = (personId) => {
  const personCredits = useQuery(
    ["person", "credits", personId],
    async ({ queryKey }) => {
      const [, , personId] = queryKey;
      const resp = await client.get(
        "/person/" + personId + "/combined_credits"
      );
      return {
        ...resp.data,
        cast: resp.data.cast.map(normalizeMedia),
        crew: resp.data.crew.map(normalizeMedia),
      };
    },
    {
      staleTime: 1000 * 60 * 1000,
      enabled: personId !== undefined,
    }
  );
  return personCredits;
};
