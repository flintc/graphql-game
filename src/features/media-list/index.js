import { motion } from "framer-motion";
import React from "react";
import { useQueryClient } from "react-query";
import { useQueryParams } from "../../shared/useQueryParams";
import { useUser } from "../../shared/user-context";

export const MediaList = ({
  mediaComponents,
  Filters,
  StarButton,
  useMediaList,
  listQuery,
}) => {
  const params = useQueryParams();
  const { results, total_results, error, status, bottomRef } = useMediaList({
    listQuery,
    ...params,
  });
  const user = useUser();
  const queryClient = useQueryClient();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error: {JSON.stringify(error)}</p>;
  }

  return (
    <div className="flex flex-col h-full">
      <motion.ul initial={{ filter: "blur( 0px )" }}>
        {results?.map((movie, ix) => {
          let ref;
          if (ix === results.length - 5) {
            ref = bottomRef;
          }
          if (movie.genre_ids) {
            queryClient.setQueryData(
              [movie.media_type, "details", String(movie.id)],
              {
                ...movie,
                genres: movie.genre_ids.map((x) => ({ id: x })),
              }
            );
          }

          return (
            <li ref={ref} key={movie.id}>
              {React.createElement(mediaComponents[movie.media_type], {
                entity: movie,
                StarButton: user && StarButton,
              })}
            </li>
          );
        })}
      </motion.ul>
      {Filters && <Filters numResults={total_results} />}
    </div>
  );
};
