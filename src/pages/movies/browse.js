import { StarIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQueryClient } from "react-query";
import { useMovieBrowse } from "../../lib/useMovieBrowse";
import { useQueryParams } from "../../lib/useQueryParams";
import { useUserStarred } from "../../lib/useUserStarred";

const StarButton = ({ movie }) => {
  const { starredQuery, addStarMutation, removeStarMutation } =
    useUserStarred();
  if (starredQuery.status === "loading") {
    return null;
  }
  if (starredQuery.status === "error") {
    return null;
  }
  const canRemove = starredQuery.data?.includes(String(movie.id));
  return (
    <button
      className="absolute p-1 text-white bottom-5 right-3"
      aria-label={`${canRemove ? "Remove" : "Add"} ${movie.title} ${
        canRemove ? "from" : "to"
      } favorites`}
      onClick={async (e) => {
        e.preventDefault();
        if (canRemove) {
          removeStarMutation.mutate(String(movie.id));
        } else {
          addStarMutation.mutate(String(movie.id));
        }
      }}
    >
      {canRemove ? (
        <StarIconFilled className="w-8 h-8 text-yellow-9" />
      ) : (
        <StarIcon className="w-8 h-8 text-white" />
      )}
    </button>
  );
};

export default function MoviesPage() {
  const params = useQueryParams();
  const { data, error, status, bottomRef } = useMovieBrowse(params);
  const queryClient = useQueryClient();

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error: {JSON.stringify(error)}</p>;
  }
  const results = data.pages.map((x) => x.results).flat();
  return (
    <div>
      <ul>
        {results.map((movie, ix) => {
          let ref;
          if (ix === results.length - 5) {
            ref = bottomRef;
          }
          queryClient.setQueryData(["movie", "details", String(movie.id)], {
            ...movie,
            genres: movie.genre_ids.map((x) => ({ id: x })),
          });
          // queryClient.invalidateQueries(["movie", "details", String(movie.id)]);

          return (
            <li ref={ref} key={movie.id}>
              <Link
                href={{ pathname: `/movies/[id]`, query: { id: movie.id } }}
              >
                <a className="text-gray-12">
                  <div className="relative mx-4 my-2 overflow-x-hidden rounded-lg ">
                    <div className="absolute bottom-0 left-0 w-full px-4 pt-16 pb-6 text-2xl bg-gradient-to-t from-black/90 via-black/70 to-black/0">
                      {movie.title}
                      {` `}
                      {movie.release_date && (
                        <span className="text-xl whitespace-nowrap">
                          ( {movie?.release_date?.split("-")?.[0]} )
                        </span>
                      )}
                    </div>
                    <motion.img
                      layout
                      layoutId={`movie-backdrop-${movie.id}`}
                      src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    />
                    <StarButton movie={movie} />
                  </div>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
