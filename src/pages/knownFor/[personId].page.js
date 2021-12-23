/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { usePerson } from "../../lib/usePerson";

import { useKnownFor } from "../../lib/useKnownFor";
import { usePersonCredits } from "../../lib/usePersonCredits";
import Link from "next/link";
import _ from "lodash";
import { getGeneres } from "../../lib/queryClient";
import { useState } from "react";
import { useMovieSearch } from "../../lib/useMovieSearch";
import { useKeywords } from "../../lib/useKeywords";
import Image from "next/image";

const filterSearchResults = (result) => {
  if (result.media_type === "movie") {
    return result.vote_count > 100 && result.poster_path;
  } else if (result.media_type === "tv") {
    return result.popularity > 0.99 && result.poster_path;
  }
  return false;
};

function KnownForSearchResult({ result, onGuess }) {
  return (
    <div className="py-1 text-sm text-gray-12 dark:text-gray-11">
      <button onClick={onGuess}>
        {["movie"].includes(result.media_type) ? (
          <span>
            {result.title} ({result?.release_date?.split("-")?.[0]}){""}
          </span>
        ) : ["tv"].includes(result.media_type) ? (
          <span>
            {result.name} ({result?.first_air_date?.split("-")?.[0]})
          </span>
        ) : null}
      </button>
    </div>
  );
}

function KnownForSearch({ setGuessed }) {
  const { data, inputProps, onCancel } = useMovieSearch();
  return (
    <div className="relative px-4">
      {data?.results?.length ? (
        <div className="absolute z-50 bottom-full">
          <ul className="z-50 max-h-[30vh] px-4 py-2 mb-1 overflow-auto rounded-lg shadow-md bg-gray-1 dark:bg-gray-4">
            {data?.results?.filter(filterSearchResults).map((result) => {
              return (
                <KnownForSearchResult
                  key={result.id}
                  result={result}
                  onGuess={() => {
                    setGuessed((guessed) => ({
                      ...guessed,
                      [result.id]: true,
                    }));
                    onCancel();
                  }}
                />
              );
            })}
          </ul>
        </div>
      ) : null}
      <input
        className=""
        placeholder="Search The Movie Database"
        {...inputProps}
      />
    </div>
  );
}

function KnownForItem({ title, guessed }) {
  const router = useRouter();
  const numHints = 3;
  const movie = title;
  const hintPrompt = String(movie.id) === router.query?.hintPrompt;
  const hintNumber = parseInt(router.query?.[movie.id] || -1);
  const shouldReveal = guessed || hintNumber >= numHints;
  const { data, status } = useKeywords(movie.id, movie.media_type);
  return (
    <li
      key={movie.id}
      className="relative overflow-hidden z-10 rounded-lg aspect-h-4 aspect-w-3.5"
    >
      <img
        alt="Unknown"
        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
        className={[
          "transition duration-1000 delay-150",
          shouldReveal ? "" :"blur-xl",
        ].join(` `)}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        {hintNumber > -1 && !shouldReveal && (
          <div className="absolute top-0 left-0 flex flex-wrap items-center">
            <span className="mx-2 text-sm uppercase text-gray-12 whitespace-nowrap">
              {movie.media_type}
            </span>
            {hintNumber > 0 && (
              <>
                <div className="w-1 h-1 rounded-full bg-gray-11" />
                <span className="mx-2 text-sm uppercase text-gray-12 whitespace-nowrap">
                  {movie?.release_date?.split("-")?.[0]}
                </span>
              </>
            )}
            <div className="flex flex-wrap">
              {hintNumber > 1 && (
                <>
                  {data?.keywords.slice(0, 3).map((x) => {
                    return (
                      <span
                        key={x.name}
                        className="mx-1.5 text-xs text-gray-11 bg-gray-3 px-1 py-0.5 rounded-md my-[0.1rem] whitespace-nowrap"
                      >
                        {x.name}
                      </span>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        )}
        {hintPrompt & !shouldReveal ? (
          <>
            <button
              onClick={(e) => {
                router.replace(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, hintPrompt: null },
                  },
                  null,
                  { scroll: false }
                );
              }}
              className="absolute inset-0 flex items-center justify-center w-full"
            />
            {hintNumber >= numHints - 1 ? (
              <button
                onClick={(e) => {
                  router.replace(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        hintPrompt: null,
                        [movie.id]:
                          parseInt(router.query?.[movie.id] || -1) + 1,
                      },
                    },
                    null,
                    { scroll: false }
                  );
                }}
                className="relative px-4 py-2 border rounded-full bg-gray-11 text-gray-3 border-gray-3"
              >
                reveal answer
              </button>
            ) : (
              <button
                onClick={(e) => {
                  router.replace(
                    {
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        // hintPrompt: null,
                        [movie.id]:
                          parseInt(router.query?.[movie.id] || -1) + 1,
                      },
                    },
                    null,
                    { scroll: false }
                  );
                }}
                className="relative px-4 py-2 border rounded-full bg-gray-11 text-gray-3 border-gray-3"
              >
                reveal hint?
              </button>
            )}
          </>
        ) : shouldReveal ? (
          <Link
            passHref
            href={{
              pathname: `/${
                movie.media_type === "movie" ? "movies" : "tv"
              }/[id]`,
              query: { id: movie.id },
            }}
          >
            <a className="w-full h-full"></a>
          </Link>
        ) : (
          <button
            onClick={(e) => {
              if (!hintPrompt && !shouldReveal) {
                router.replace(
                  {
                    pathname: router.pathname,
                    query: { ...router.query, hintPrompt: movie.id },
                  },
                  null,
                  { scroll: false }
                );
              }
            }}
            className="absolute inset-0 flex items-center justify-center w-full"
          />
        )}
      </div>
    </li>
  );
}

function KnownForGuessing({ titles }) {
  // const { data, inputProps, onCancel } = useMovieSearch();
  const [state, setState] = useState("initial");
  const router = useRouter();
  const [guessed, setGuessed] = useState(
    _.zipObject(
      titles.map((x) => x.id),
      Array(titles.length).fill(false)
    )
  );
  return (
    <div className="pb-10">
      <div className="relative">
        <ul className="grid grid-cols-2 gap-4 px-4 py-2 md:gap-1 md:grid-cols-4">
          {titles.map((movie) => {
            return (
              <KnownForItem
                key={movie.id}
                title={movie}
                guessed={guessed[movie.id]}
              />
            );
          })}
        </ul>
      </div>
      <KnownForSearch setGuessed={setGuessed} />
    </div>
  );
}

function KnownForAnswer({ person }) {
  const { data, status } = useKnownFor(person);

  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error!</p>;
  }
  return <KnownForGuessing onHide={() => setState("hidden")} titles={data} />;
}

export default function KnownFor({ person }) {
  const router = useRouter();
  const { data, status, error } = usePerson(router.query.personId);

  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error!</p>;
  }
  return (
    <div>
      <div className="grid items-center grid-cols-12 gap-1 px-4 py-2">
        <div className="flex items-center col-span-2 lg:col-span-2">
          <Image
            alt="foo"
            className="object-cover object-top scale-[98%] col-span-2 rounded-md"
            width={1400}
            height={2000}
            src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
          />
        </div>
        <div className="col-span-10 px-2">
          <h1 className="px-0 text-3xl md:text-6xl md:mb-4 text-gray-12">
            {data.name}
          </h1>
          <p className="px-0 -mb-1 text-base md:-mb-0 md:text-lg text-gray-11 line-clamp-5 md:line-clamp-10">
            is best known for:
          </p>
        </div>
      </div>
      <KnownForAnswer person={data} />
    </div>
  );
}
