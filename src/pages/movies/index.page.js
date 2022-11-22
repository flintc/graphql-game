/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import Link from "next/link";
import { useQuery } from "react-query";
import { MediaList } from "../../features/media-list";
import { MovieCard } from "../../features/movie-card";
import { getGeneres } from "../../lib/queryClient";
import { useMultiSearch } from "../../features/multi-search";
import { useQueryParams } from "../../shared/useQueryParams";
import { GENRE_LUT } from "../../shared/constants";
import ScrollArea from "../../shared/ScrollArea";

const MovieLink = ({ entity: movie }) => {
  return (
    <li key={`${movie.id}`}>
      <Link
        href={{ pathname: "/movies/[id]", query: { id: movie.id } }}
        scroll={false}
      >
        <a>
          {movie.title} (Film - {movie?.release_date?.split("-")[0]})
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const TvLink = ({ entity: movie }) => {
  return (
    <li key={`${movie.id}`}>
      <Link
        href={{ pathname: "/tv/[id]", query: { id: movie.id } }}
        scroll={false}
      >
        <a>
          {movie.name} (TV Series - {movie?.first_air_date?.split("-")?.[0]})
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const PersonLink = ({ entity: person }) => {
  return (
    <li key={`${person.id}`}>
      <Link
        href={{ pathname: "/people/[id]", query: { id: person.id } }}
        scroll={false}
      >
        <a>
          {person.name}
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const filterResults = (result) => {
  if (result.media_type === "movie") {
    return result.vote_count > 100 && result.poster_path;
  } else if (result.media_type === "person") {
    return result.popularity > 0.99 && result.profile_path;
  } else if (result.media_type === "tv") {
    return result.popularity > 0.99 && result.poster_path;
  }
  return false;
};

function MoviesSearchResults({ results }) {
  return (
    <div>
      <ul>
        {results.filter(filterResults).map((result) => {
          return (
            <div key={result.id}>
              {["movie"].includes(result.media_type) ? (
                <MovieLink entity={result} />
              ) : ["tv"].includes(result.media_type) ? (
                <TvLink entity={result} />
              ) : (
                <PersonLink entity={result} />
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

function MoviesBrowseCategories() {
  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  return (
    <div className="mt-2 space-y-5">
      <div className="space-y-3">
        <div className="mx-2">Browse by Decade</div>
        <ScrollArea>
          <div className="flex gap-2 flex-nowrap">
            {[
              {
                title: "The 1960s",
                years: ["1960", "1969"],
                className: "from-teal-9 to-brown-9",
              },
              {
                title: "The 1970s",
                years: ["1970", "1979"],
                className: "from-grass-9 to-red-9",
              },
              {
                title: "The 1980s",
                years: ["1980", "1989"],
                className: "from-tomato-9 to-plum-9",
              },
              {
                title: "The 1990s",
                years: ["1990", "1999"],
                className: "from-crimson-9 to-violet-9",
              },
              {
                title: "The 2000s",
                years: ["2000", "2009"],
                className: "from-plum-9 to-blue-9",
              },
              {
                title: "The 2010s",
                years: ["2010", "2019"],
                className: "from-violet-9 to-teal-9",
              },
              {
                title: "The 2020s",
                years: ["2020", "2029"],
                className: "from-blue-9 to-grass-9",
              },
            ].map((decade) => {
              return (
                <Link
                  key={decade.title}
                  href={{
                    pathname: "/movies/browse",
                    query: {
                      with_release_type: 3, // 3 = release
                      "primary_release_date.gte": `${decade.years[0]}-01-01`,
                      "primary_release_date.lte": `${decade.years[1]}-12-31`,
                    },
                  }}
                >
                  <a
                    className={`w-32 h-32 text-white shadow-md rounded-lg flex justify-start p-2 items-end text-3xl  bg-gradient-to-br ${decade.className}`}
                  >
                    {decade.title}
                  </a>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <div className="space-y-3">
        <div className="mx-2">Browse by Genre</div>
        <div className="flex flex-wrap items-center justify-start gap-2 mx-2">
          {genres?.data?.genres?.map((genre) => {
            return (
              <Link
                passHref
                key={genre.id}
                href={{
                  pathname: "/movies/browse",
                  query: { with_genres: `${genre.id}` },
                }}
              >
                <a
                  className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                  style={{
                    borderColor: `var(--${GENRE_LUT[genre.id]}7)`,
                    backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
                    color: `var(--${GENRE_LUT[genre.id]}12)`,
                  }}
                >
                  {genre.name}
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function MoviesPage({ search, results, ...rest }) {
  const queryParams = useQueryParams();
  const { data, inputProps, onCancel } = useMultiSearch({
    initialData: { results, ...rest },
  });

  return (
    <div className="px-2">
      <motion.div layoutId="foo" layout className="flex gap-2 px-1 flex-nowrap">
        <motion.input placeholder="Search The Movie Database" {...inputProps} />
        <AnimatePresence>
          {!_.isNil(queryParams.search) && (
            <motion.button
              className="text-gray-11 px-1 py-0.5"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              onClick={onCancel}
            >
              cancel
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      {_.isNil(queryParams.search) ? (
        // <MoviesBrowse />
        <MoviesBrowseCategories />
      ) : (
        <MediaList
          mediaComponents={{ movie: MovieCard, tv: TvLink, person: PersonLink }}
          useMediaList={useMovieSearch}
        />
      )}
    </div>
  );
}

// <MoviesSearchResults results={data?.results || []} />
