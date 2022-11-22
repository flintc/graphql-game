/* eslint-disable @next/next/no-img-element */
import { MovieCard } from "../../features/movie-card";
import { MovieFilters } from "../../features/movie-filters";
import { MediaList } from "../../features/media-list";
import { StarButton } from "../../features/user-starred";
import { useMovieBrowse } from "../../features/movie-filters";

export default function MoviesPage() {
  return (
    <MediaList
      mediaComponents={{ movie: MovieCard }}
      Filters={MovieFilters}
      StarButton={StarButton}
      useMediaList={useMovieBrowse}
    />
  );
}
