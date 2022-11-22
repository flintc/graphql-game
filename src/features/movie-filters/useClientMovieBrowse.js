import { useQueryClient } from "react-query";
import _ from "lodash";

export const useClientMovieBrowse = ({ listQuery, ...params }) => {
  const queryClient = useQueryClient();
  let results = listQuery?.data?.map((x) => ({
    ...(queryClient.getQueryData(["movie", "details", x]) || {}),
    id: x,
    media_type: "movie",
  }));
  console.log("results", listQuery, results);
  if (params.with_genres && results?.[0]?.title) {
    results = results.filter(
      (x) =>
        _.intersection(
          params.with_genres.split("|"),
          x.genres.map((x) => String(x.id))
        ).length > 0
    );
    console.log("results filtered", results);
  }
  return {
    ...listQuery,
    results: results,
    total_results: results?.length,
  };
};
