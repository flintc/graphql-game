/* eslint-disable @next/next/no-img-element */
import {
  CheckIcon,
  FilterIcon,
  StarIcon,
  XIcon,
} from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Drawer } from "../../components/drawer";
import { GENRE_LUT } from "../../constants";
import { getGeneres } from "../../lib/queryClient";
import { useKeyword } from "../../lib/useKeyword";
import { useMovieBrowse } from "../../lib/useMovieBrowse";
import { usePerson } from "../../lib/usePerson";
import { usePersonSearch } from "../../lib/usePersonSearch";
import { useQueryParams } from "../../lib/useQueryParams";
import { useUserStarred } from "../../lib/useUserStarred";
import { useWatchProviders } from "../../lib/useWatchProviders";
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
    params.with_genres?.includes(",") ? "," :"|"
  );
  const currGenres = new Set(params.with_genres?.split(genreOperator));
  currGenres.delete("");
  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  return (
    <details open className="space-y-2">
      <summary className="font-medium">
        Include
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
        {[...currGenres].length > 0 && (
          <span className="ml-2 font-normal text-gray-11">
            ({[...currGenres].length})
          </span>
        )}
      </summary>
      <div className="flex flex-wrap items-center justify-start gap-2">
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
    </details>
  );
};

const WithoutGenresFilter = () => {
  const params = useQueryParams();
  const genreOperator = params.without_genres?.includes("|") ? "|" :",";
  const currGenres = new Set(params.without_genres?.split(genreOperator));
  currGenres.delete("");
  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
  return (
    <details open={[...currGenres].length > 0} className="space-y-2">
      <summary className="font-medium">
        Exclude Genres
        {[...currGenres].length > 0 && (
          <span className="ml-2 font-normal text-gray-11">
            ({[...currGenres].length})
          </span>
        )}
      </summary>
      <div className="flex flex-wrap items-center justify-start gap-2">
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
    </details>
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
      <div className="font-medium">
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

const WatchProviders = ({ providers, selected, operator }) => {
  const params = useQueryParams();
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1.5">
      {providers.map((provider) => {
        const newWithWatchProviders = new Set(selected);
        if (selected.has(String(provider.provider_id))) {
          newWithWatchProviders.delete(String(provider.provider_id));
        } else {
          newWithWatchProviders.add(String(provider.provider_id));
        }
        const with_watch_providers = Array.from(newWithWatchProviders).join(
          operator
        );
        const isSelected = selected.has(String(provider.provider_id));
        return (
          <Link
            passHref
            key={provider.provider_id}
            shallow={true}
            replace={true}
            href={{
              pathname: "/movies/browse",
              query: {
                ...params,
                watch_region: "US",
                with_watch_providers: with_watch_providers,
              },
            }}
          >
            <a
              className={`
                  text-xs shadow-md whitespace-nowrap relative`}
            >
              <img
                alt="foo"
                className={`w-12 h-12 rounded-lg transition duration-200
                ${isSelected ? "scale-90" : "grayscale"}`}
                src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
              />
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-0 right-0 flex rounded-full translate-x-3/12 translate-y-3/12 place-content-center bg-green-11"
                  >
                    <CheckIcon className="w-4 h-4 text-green-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

const WithWatchProvidersFilter = () => {
  const params = useQueryParams();
  const [watchProvidersOperator] = useState("|");
  const currWatchProviders = new Set(
    params.with_watch_providers?.split(watchProvidersOperator)
  );
  currWatchProviders.delete("");
  const { data, status } = useWatchProviders();
  if (status === "loading") {
    return null;
  }
  if (status === "error") {
    return null;
  }
  return (
    <details open>
      <summary className="font-medium">
        Watch Providers
        {[...currWatchProviders].length > 0 && (
          <span className="ml-2 font-normal text-gray-11">
            ({[...currWatchProviders].length})
          </span>
        )}
      </summary>
      <div className="space-y-1.5">
        <div className="space-y-1">
          <div className="text-gray-11">Streaming</div>
          <WatchProviders
            providers={data.flatrate}
            selected={currWatchProviders}
            operator={watchProvidersOperator}
          />
        </div>
        <div className="space-y-1">
          <div className="text-gray-11">Rent/Buy</div>
          <WatchProviders
            providers={data.rentOrBuy}
            selected={currWatchProviders}
            operator={watchProvidersOperator}
          />
        </div>
      </div>
    </details>
  );
};

const SelectedPerson = ({ href, personId }) => {
  const params = useQueryParams();
  const { data, status } = usePerson(personId);

  if (status === "loading") {
    return null;
  }
  if (status === "error") {
    return null;
  }
  // const selected = new Set(params.with_cast?.split(operator));
  return (
    <Link href={href}>
      <a className="flex items-center justify-center gap-1 px-2 py-1 text-sm rounded-lg w-max bg-gray-3">
        <XIcon className="w-4 h-4 text-gray-9" />
        {data.name}
      </a>
    </Link>
  );
};

const WithCastFilter = () => {
  const router = useRouter();
  const params = useQueryParams();
  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue_] = useState();
  const debouncedSetValue = useMemo(
    () =>
      _.throttle(
        (val) => {
          setDebouncedValue_(val);
        },
        500,
        { leading: false }
      ),
    []
  );
  const [operator, setOperator] = useState(
    params.with_cast?.includes(",") ? "," :"|"
  );
  const selected = new Set(params.with_cast?.split(operator));
  selected.delete("");
  const { data, status } = usePersonSearch(debouncedValue);
  return (
    <details open={[...selected].length > 0}>
      <summary className="font-medium">
        Cast
        {[...selected].length > 0 && (
          <span className="ml-2 font-normal text-gray-11">
            ({[...selected].length})
          </span>
        )}
      </summary>
      <div className="relative py-2">
        <input
          className=""
          placeholder="Search The Movie Database"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            debouncedSetValue(e.target.value);
          }}
          onBlur={() => {
            setTimeout(() => {
              setValue("");
            }, 200);

            debouncedSetValue("");
            // setDebouncedValue_(undefined);
          }}
        />
        {data?.results?.length && value?.length > 0 ? (
          <div className="absolute z-50 top-full">
            <ul className="z-50 max-h-[30vh] px-4 py-2 mb-1 overflow-auto rounded-lg shadow-md bg-gray-1 dark:bg-gray-4 w-full">
              {data?.results?.map((result) => {
                let newCast = new Set(selected);
                if (selected.has(String(result.id))) {
                  newCast.delete(String(result.id));
                } else {
                  newCast.add(String(result.id));
                }
                const with_cast = Array.from(newCast).join(operator);
                return (
                  <li key={result.id}>
                    <Link
                      passHref
                      shallow={true}
                      replace={true}
                      href={{
                        pathname: "/movies/browse",
                        query: {
                          ...params,
                          with_cast,
                        },
                      }}
                    >
                      <a
                        className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                        onClick={() => {
                          setValue("");
                        }}
                      >
                        {result.name}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="px-2">
        {[...selected].length > 0 && (
          <div className="py-1">
            Include{""}
            <select
              value={operator}
              className="pl-2 pr-8 mx-2 py-0.5 rounded-md shadow-sm bg-gray-2 focus:ring-primary-6 focus:border-primary-3 sm:max-w-xs sm:text-sm border-gray-3"
              onChange={(e) => {
                if (!params?.with_cast?.length) {
                  setOperator(e.target.value);
                } else {
                  let newSelected = new Set(selected);
                  setOperator(e.target.value);
                  router.replace({
                    pathname: router.pathname,
                    query: {
                      ...params,
                      with_cast: [...newSelected].join(e.target.value),
                    },
                  });
                }
              }}
            >
              <option value=",">ALL OF</option>
              <option value="|">ANY OF</option>
            </select>
          </div>
        )}
        <div className="flex flex-wrap justify-start gap-1 pt-1 place-content-center">
          {[...selected].map((x) => {
            let newCast = new Set(selected);
            newCast.delete(String(x));
            const with_cast = Array.from(newCast).join(operator);
            return (
              <SelectedPerson
                key={x}
                personId={x}
                href={{
                  pathname: "/movies/browse",
                  query: {
                    ...params,
                    with_cast,
                  },
                }}
              />
            );
          })}
        </div>
      </div>
    </details>
  );
};

const Filters = ({ resultCount }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ translateX: "-100%" }}
            animate={{ translateX: "0%" }}
            exit={{ translateX: "-100%" }}
            transition={{
              translateX: { type: "spring", damping: 30, stiffness: 280 },
            }}
            className="fixed inset-0 px-6 py-4 overflow-y-auto bg-gray-2"
          >
            <div className="flex flex-col min-h-full gap-6 ">
              <WithCastFilter />
              <WithGenresFilter />
              <WithoutGenresFilter />
              <WithKeywordsFilter />
              <WithWatchProvidersFilter />
              <div className="flex items-end justify-end flex-1">
                <button
                  className="px-4 py-2 mb-6 font-semibold rounded-full item-end bg-gray-9"
                  onClick={() => setShow((x) => !x)}
                >
                  See {resultCount} results
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!show && (
        <button
          className="fixed px-4 py-2 font-semibold border rounded-full shadow-2xl bottom-8 right-8 bg-secondary-9 text-secondary-12 border-secondary-12"
          onClick={() => setShow((x) => !x)}
        >
          Filters
        </button>
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
    <div className="flex flex-col h-full">
      <motion.ul initial={{ filter: "blur( 0px )" }}>
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
      </motion.ul>
      <Drawer
        trigger={
          <button className="fixed p-6 font-semibold rounded-full shadow-lg bottom-14 right-8 bg-gradient-to-r from-secondary-7 to-secondary-9 focus:outline-none">
            <FilterIcon className="w-6 h-6" />
          </button>
        }
        close={
          <button className="w-full px-6 py-4 text-lg font-semibold text-white rounded-full bg-gradient-to-r from-gray-7 to-gray-10">
            See {data?.pages?.[0]?.total_results} results
          </button>
        }
      >
        <div className="flex flex-col min-h-full gap-6 px-6 pt-8 mb-20 rounded-t-3xl">
          <WithCastFilter />
          <WithGenresFilter />
          <WithoutGenresFilter />
          <WithKeywordsFilter />
          <WithWatchProvidersFilter />
        </div>
      </Drawer>
    </div>
  );
}
