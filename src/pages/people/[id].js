import { useRouter } from "next/router";
import { usePerson } from "../../lib/usePerson";

import { useKnownFor } from "../../lib/useKnownFor";
import { usePersonCredits } from "../../lib/usePersonCredits";
import Link from "next/link";
import _ from "lodash";
import { getGeneres } from "../../lib/queryClient";
import { useState } from "react";
import { useMovieSearch } from "../../lib/useMovieSearch";

const filterResults = (result) => {
  return (
    result.popularity > 0.99 &&
    result.vote_count > 100 &&
    result.poster_path !== null
  );
};

const creditsDepartmentMap = {
  Directing: {
    header: "Director",
    key: "crew",
    filter: (result) => {
      if (["Writer", "Director"].includes(result.job)) {
        return false;
      }
      return (
        result.popularity > 0.99 &&
        result.vote_count > 100 &&
        result.poster_path !== null
      );
      // return true;
    },
  },
  Writing: {
    header: "Writer or Director",
    key: "crew",
    filter: (result) => {
      if (["Writer", "Director"].includes(result.job)) {
        return false;
      }
      return (
        result.popularity > 0.99 &&
        result.vote_count > 100 &&
        result.poster_path !== null
      );
      // return true;
    },
  },
  Production: {
    header: "Writer or Director",
    key: "crew",
    filter: (result) => {
      if (["Writer", "Director"].includes(result.job)) {
        return false;
      }
      return (
        result.popularity > 0.99 &&
        result.vote_count > 100 &&
        result.poster_path !== null
      );
      // return true;
    },
  },
  Acting: {
    header: "Actor",
    key: "cast",
    filter: filterResults,
  },
};

function PersonCredits({ knownForDepartment }) {
  const router = useRouter();
  const { data, status, error } = usePersonCredits(router.query.id);
  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }
  const { key, filter, header } = creditsDepartmentMap[knownForDepartment];
  return (
    <div>
      credits!
      <div>
        <div>
          <ul>
            {_.uniqBy(data?.[key]?.filter(filter), "id").map((movie) => (
              <li key={movie.id}>
                <Link
                  href={{
                    pathname: `/movies/[id]`,
                    query: { id: movie.id },
                  }}
                >
                  <a>{movie.title}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
const filterSearchResults = (result) => {
  if (result.media_type === "movie") {
    return result.vote_count > 100 && result.poster_path;
  } else if (result.media_type === "tv") {
    return result.popularity > 0.99 && result.poster_path;
  }
  return false;
};

function KnownForGuessing({ titles, onHide }) {
  const { data, inputProps, onCancel } = useMovieSearch();
  const [guessed, setGuessed] = useState(
    _.zipObject(
      titles.map((x) => x.id),
      Array(titles.length).fill(false)
    )
  );
  return (
    <div>
      <button onClick={onHide}>Hide Known For</button>
      <div>
        <ul>
          {titles.map((movie) => (
            <li key={movie.id}>
              {guessed[movie.id] ? (
                <Link
                  href={{
                    pathname: `/movies/[id]`,
                    query: { id: movie.id },
                  }}
                >
                  <a>{movie.title || movie.name}</a>
                </Link>
              ) : (
                <span>??????</span>
              )}
            </li>
          ))}
        </ul>
        <input placeholder="Search The Movie Database" {...inputProps} />
        <div>
          <ul>
            {data?.results?.filter(filterSearchResults).map((result) => {
              return (
                <div key={result.id}>
                  <button
                    onClick={() => {
                      setGuessed((guessed) => ({
                        ...guessed,
                        [result.id]: true,
                      }));
                      onCancel();
                    }}
                  >
                    {["movie"].includes(result.media_type) ? (
                      <span>{result.title}</span>
                    ) : ["tv"].includes(result.media_type) ? (
                      <span>{result.name}</span>
                    ) : null}
                  </button>
                </div>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function KnownFor({ person }) {
  const [state, setState] = useState("hidden");
  if (state === "hidden") {
    return (
      <div>
        <Link
          href={{
            pathname: "/knownFor/[personId]",
            query: { personId: person.id },
          }}
        >
          <a>Guess Known For</a>
        </Link>
      </div>
    );
  }
  if (state === "visible") {
    return (
      <div>
        <button onClick={() => setState("hidden")}>Hide Known For</button>
        <div>
          <ul>
            {data.map((result) => (
              <li key={result.id}>
                <Link
                  href={{
                    pathname:
                      result.media_type === "movie"
                        ? `/movies/[id]`
                        : `/tv/[id]`,
                    query: { id: result.id },
                  }}
                >
                  <a>
                    {result.media_type === "movie" ? result.title : result.name}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (state === "guessing") {
    return <KnownForGuessing onHide={() => setState("hidden")} titles={data} />;
  }

  return null;
}

export default function PersonDetailsPage() {
  const router = useRouter();
  const { data, status, error } = usePerson(router.query.id);
  if (["idle", "loading"].includes(status)) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error!</p>;
  }

  return (
    <div>
      <button
        onClick={() => {
          router.back();
        }}
      >
        Go back
      </button>
      <div>{data.name}</div>
      <img
        style={{ width: "80px", height: "120px" }}
        src={`https://image.tmdb.org/t/p/original/${data.profile_path}`}
      />
      {/* <PersonCredits knownForDepartment={data.known_for_department} /> */}
      {data && <KnownFor person={data} />}
    </div>
  );
}
