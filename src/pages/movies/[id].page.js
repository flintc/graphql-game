/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useMovie } from "../../entities/movie/useMovie";
import { GenrePill, useGenres } from "../../entities/genre";
import { motion } from "framer-motion";
import {
  MovieCredits,
  MovieKeywords,
  MovieRecommendations,
  MovieWatchProviders,
} from "../../features/movie-details";
import { SelectMovie } from "../../features/rotten-or-fresh";

export default function MovieDetailsPage() {
  const router = useRouter();
  const { status, data, error } = useMovie(router.query.id);
  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }
  return (
    <div>
      <div key={data.id} className="overflow-x-hidden">
        <div className="relative ">
          <div className="w-full overflow-x-hidden">
            <div className="absolute flex justify-around gap-2 flex-nowrap bottom-2 left-2">
              {data?.genres?.map((genre) => {
                return <GenrePill key={genre.id} {...genre} />;
              })}
            </div>
          </div>
          <motion.img
            layout
            layoutId={`movie-backdrop-${data.id}`}
            className="w-full"
            src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
          />
        </div>
        <div className="px-2 mt-2">
          <div className="flex items-end gap-3">
            <h1 className="text-3xl leading-8 text-gray-12">
              {data?.title}
              {` `}
              {data?.release_date && (
                <span className="text-lg text-gray-10 whitespace-nowrap">
                  ( {data?.release_date.split("-")?.[0]} )
                </span>
              )}
            </h1>
          </div>
          <SelectMovie movie={data} />
          <p className="mt-2 text-sm text-gray-11">{data?.overview}</p>
        </div>
        <MovieKeywords movie={data} />
        <MovieCredits movieId={data.id} />
        <MovieWatchProviders movieId={data.id} />
        <MovieRecommendations movieId={data.id} />
      </div>
    </div>
  );
}
