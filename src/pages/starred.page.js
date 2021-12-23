import Link from "next/link";
import { useMovie } from "../lib/useMovie";
import { useUserStarred } from "../lib/useUserStarred";
import { motion } from "framer-motion";
import { StarIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";

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

const Starred = ({ id }) => {
  const { status, data: movie, error } = useMovie(id);
  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }
  return (
    <Link href={{ pathname: `/movies/[id]`, query: { id: movie.id } }}>
      <a className="text-gray-12">
        <div className="relative mx-4 my-2 overflow-x-hidden rounded-lg ">
          <div className="absolute bottom-0 left-0 w-full px-4 pt-16 pb-6 text-2xl bg-gradient-to-t from-black/90 via-black/70 to-black/0">
            <div className="pr-8">
              {movie.title}
              {` `}
              {movie.release_date && (
                <span className="text-xl whitespace-nowrap">
                  ( {movie?.release_date?.split("-")?.[0]} )
                </span>
              )}
            </div>
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
  );
};

export default function StarredPage() {
  const { starredQuery } = useUserStarred();
  if (starredQuery.status === "loading") {
    return null;
  }
  if (starredQuery.status === "error") {
    return null;
  }
  return (
    <div>
      <h1>Starred</h1>
      <ul>
        {starredQuery.data?.map((id) => (
          <li key={id}>
            <Starred id={id} />
          </li>
        ))}
      </ul>
    </div>
  );
}
