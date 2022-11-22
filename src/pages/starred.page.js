import { useMovie } from "../entities/movie/useMovie";
import { StarButton, useUserStarred } from "../features/user-starred";
import { MovieCard } from "../features/movie-card";
import { MediaList } from "../features/media-list";
import { MovieFilters, useClientMovieBrowse } from "../features/movie-filters";
import _ from "lodash";

const StarredMovieCard = ({ entity: { id, ...rest } }) => {
  const { status, data: movie, error } = useMovie(id);
  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }
  return <MovieCard entity={movie} StarButton={StarButton} />;
};

export default function StarredPage() {
  const { starredQuery } = useUserStarred();
  return (
    <div>
      <h1>Starred</h1>
      <MediaList
        mediaComponents={{ movie: StarredMovieCard }}
        Filters={MovieFilters}
        useMediaList={useClientMovieBrowse}
        listQuery={starredQuery}
      />
    </div>
  );
}
