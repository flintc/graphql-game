import Link from "next/link";
import { motion } from "framer-motion";

export const MovieCard = ({ entity: movie, StarButton }) => {
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
          {StarButton && <StarButton movie={movie} />}
        </div>
      </a>
    </Link>
  );
};
