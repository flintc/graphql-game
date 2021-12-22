import { StarIcon, XIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { GENRE_LUT } from "../../constants";
import { getGeneres } from "../../lib/queryClient";
import { useKeyword } from "../../lib/useKeyword";
import { useMovieBrowse } from "../../lib/useMovieBrowse";
import { useQueryParams } from "../../lib/useQueryParams";
import { useUserStarred } from "../../lib/useUserStarred";
import { useUser } from "../../user-context";

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

const WithGenresFilter = () => {
  const router = useRouter();
  const params = useQueryParams();
  const [genreOperator, setGenreOperator] = useState(
    params.with_genres?.includes("|") ? "|" :","
  );
  const currGenres = new Set(params.with_genres?.split(genreOperator));

  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  return (
    <div className="space-y-2">
      <div className="">
        Include{""}
        <select
          value={genreOperator}
          className="pl-2 pr-8 mx-2 py-0.5 rounded-md shadow-sm bg-gray-2 focus:ring-primary-6 focus:border-primary-3 sm:max-w-xs sm:text-sm border-gray-3"
          onChange={(e) => {
            if (!params?.with_genres?.length) {
              setGenreOperator(e.target.value);
            } else {
              let newGenres = new Set(currGenres);
              setGenreOperator(e.target.value);
              router.replace({
                pathname: router.pathname,
                query: {
                  ...params,
                  with_genres: [...newGenres].join(e.target.value),
                },
              });
            }
          }}
        >
          <option value=",">ALL OF</option>
          <option value="|">ANY OF</option>
        </select>
        Genres
      </div>
      <div className="flex flex-wrap items-center justify-start gap-2 mx-2">
        {genres?.data?.genres?.map((genre) => {
          const foo = currGenres.has(String(genre.id))
            ? {
                borderColor: `var(--${GENRE_LUT[genre.id]}7)`,
                backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
                color: `var(--${GENRE_LUT[genre.id]}12)`,
              }
            : {
                borderColor: `var(--gray7)`,
                backgroundColor: `var(--gray3)`,
                color: `var(--gray12)`,
              };
          let newGenres = new Set(currGenres);
          if (currGenres.has(String(genre.id))) {
            newGenres.delete(String(genre.id));
          } else {
            newGenres.add(String(genre.id));
          }
          const with_genres = Array.from(newGenres).join(genreOperator);
          return (
            <Link
              passHref
              key={genre.id}
              shallow={true}
              replace={true}
              href={{
                pathname: "/movies/browse",
                query: {
                  ...params,
                  with_genres: with_genres,
                },
              }}
            >
              <a
                className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                style={foo}
              >
                {genre.name}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const KeywordToggle = ({ keywordId }) => {
  const params = useQueryParams();
  const withKeywordOperator = params.with_keywords?.includes("|") ? "|" :",";

  const currKeywords = new Set(
    params.with_keywords?.split(withKeywordOperator)
  );
  const newKeywords = new Set(currKeywords);
  const { data, status } = useKeyword(keywordId);
  console.log("KeywordToggle", withKeywordOperator, data, status);
  newKeywords.delete(String(keywordId));
  if (status === "loading") {
    return null;
  }
  if (status === "error") {
    return null;
  }
  return (
    <Link
      key={data.id}
      href={{
        pathname: "/movies/browse",
        query: { with_keywords: [...newKeywords].join(withKeywordOperator) },
      }}
    >
      <a className="flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-lg bg-gray-3">
        <XIcon className="w-4 h-4 text-gray-9" />
        {data.name}
      </a>
    </Link>
  );
};

const WithKeywordsFilter = () => {
  const params = useQueryParams();
  const withKeywordOperator = params.with_keywords?.includes("|") ? "|" :",";

  const currKeywords = new Set(
    params.with_keywords?.split(withKeywordOperator)
  );
  if (!params.with_keywords?.length) {
    return null;
  }
  return (
    <div className="flex items-center space-x-2">
      <div className="text-sm">
        Keywords <span>{withKeywordOperator === "|" ? "(any)" :"(all)"}</span>
      </div>
      <div className="flex flex-wrap items-center justify-start gap-1">
        {[...currKeywords].map((keyword) => {
          return <KeywordToggle key={keyword} keywordId={keyword} />;
        })}
      </div>
    </div>
  );
};

const WithoutGenresFilter = () => {
  const params = useQueryParams();
  const genreOperator = params.without_genres?.includes("|") ? "|" :",";
  const currGenres = new Set(params.without_genres?.split(genreOperator));
  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  return (
    <div className="space-y-2">
      <div className="">Exclude Genres</div>
      <div className="flex flex-wrap items-center justify-start gap-2 mx-2">
        {genres?.data?.genres?.map((genre) => {
          const foo = currGenres.has(String(genre.id))
            ? {
                borderColor: `var(--${GENRE_LUT[genre.id]}7)`,
                backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
                color: `var(--${GENRE_LUT[genre.id]}12)`,
              }
            : {
                borderColor: `var(--gray7)`,
                backgroundColor: `var(--gray3)`,
                color: `var(--gray12)`,
              };
          let newGenres = new Set(currGenres);
          if (currGenres.has(String(genre.id))) {
            newGenres.delete(String(genre.id));
          } else {
            newGenres.add(String(genre.id));
          }
          const without_genres = Array.from(newGenres).join(genreOperator);
          return (
            <Link
              passHref
              key={genre.id}
              shallow={true}
              replace={true}
              href={{
                pathname: "/movies/browse",
                query: {
                  ...params,
                  without_genres: without_genres,
                },
              }}
            >
              <a
                className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                style={foo}
              >
                {genre.name}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Filters = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="px-4 py-2">
      <button onClick={() => setShow((x) => !x)}>Filters</button>
      {show && (
        <div className="space-y-4">
          <WithGenresFilter />
          <WithoutGenresFilter />
          <WithKeywordsFilter />
        </div>
      )}
    </div>
  );
};

export default function MoviesPage() {
  const params = useQueryParams();
  const { data, error, status, bottomRef } = useMovieBrowse(params);
  const user = useUser();
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
      <div>
        <Filters />
      </div>
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
                    {user && <StarButton movie={movie} />}
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
