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

function KnownForTitle({ result }) {
  const [showHints, setShowHints] = useState(0);
  const { data, status } = useKeywords(result.id, result.media_type);
  return (
    <div>
      {showHints === 4 ? (
        <span>{result.name || result.title}</span>
      ) : (
        <span>??????</span>
      )}
      {showHints >= 1 ? (
        <>
          <span>
            ( {(result?.release_date || result?.first_air_date)?.split("-")[0]}
            {""}){""}
          </span>
        </>
      ) : (
        <span>(year/first air date)</span>
      )}
      {showHints >= 2 ? (
        <>
          <span>
            ({""}
            {result.media_type === "tv"
              ? "TV Show"
              : result.media_type === "movie"
              ? "Film"
              : "unknown"}
            {""}){""}
          </span>
        </>
      ) : (
        <span>(media type)</span>
      )}
      {showHints === 3 && (
        <button onClick={() => setShowHints((x) => x + 1)}>
          reveal answer
        </button>
      )}
      {showHints >= 1 && showHints < 3 && (
        <button onClick={() => setShowHints((x) => x + 1)}>
          reveal more hints
        </button>
      )}
      {!showHints && (
        <button onClick={() => setShowHints((x) => x + 1)}>reveal hints</button>
      )}
      {showHints === 3 && (
        <div>{data.keywords.map((x) => x.name).join(" -")}</div>
      )}
    </div>
  );
}

function KnownForSearch({ setGuessed }) {
  const { data, inputProps, onCancel } = useMovieSearch();
  return (
    <div className="relative px-4">
      <input
        className=""
        placeholder="Search The Movie Database"
        {...inputProps}
      />
      {data?.results?.length && (
        <div className="absolute z-50 top-full">
          <ul className="z-50 px-4 py-2 mt-1 rounded-lg shadow-md bg-gray-1 dark:bg-gray-4">
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
      )}
    </div>
  );
}

function KnownForGuessing({ titles }) {
  // const { data, inputProps, onCancel } = useMovieSearch();
  const [guessed, setGuessed] = useState(
    _.zipObject(
      titles.map((x) => x.id),
      Array(titles.length).fill(false)
    )
  );
  console.log("...", titles);
  return (
    <div>
      <KnownForSearch setGuessed={setGuessed} />
      <div className="relative">
        <ul className="grid grid-cols-2 gap-4 px-4 py-2">
          {titles.map((movie) => (
            <li
              key={movie.id}
              className="relative overflow-hidden z-10 rounded-lg aspect-h-4 aspect-w-3.5"
            >
              <img
                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                className={[
                  // "rounded-lg",
                  "transition duration-1000",
                  guessed[movie.id] ? "" :"blur-xl",
                ].join(` `)}
              />

              {/* {guessed[movie.id] ? (
                <Link
                  href={{
                    pathname: `/movies/[id]`,
                    query: { id: movie.id },
                  }}
                >
                  <a>{movie.title || movie.name}</a>
                </Link>
              ) : (
                <KnownForTitle result={movie} />
              )} */}
            </li>
          ))}
        </ul>
      </div>
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
      <div className="flex items-center gap-1 px-4 py-2">
        {/* <div className="aspect-w-3 aspect-h-4"> */}
        <div className="w-20 h-20 overflow-hidden rounded-full">
          <img
            className="object-cover object-top scale-[98%]"
            src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
          />
        </div>

        {/* </div> */}
        <h1 className="px-4 text-3xl text-gray-12">{data.name}</h1>
      </div>
      <KnownForAnswer person={data} />
    </div>
  );
}
