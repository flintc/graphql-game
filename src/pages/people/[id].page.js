/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { usePerson } from "../../lib/usePerson";

import { usePersonCredits } from "../../lib/usePersonCredits";
import Link from "next/link";
import Image from "next/image";
import _ from "lodash";
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
    <div className="px-2">
      <h3 className="text-sm tracking-wide uppercase text-gray-12">Credits</h3>
      <div className="text-gray-11">
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
      <div className="my-1">
        <Link
          href={{
            pathname: "/knownFor/[personId]",
            query: { personId: person.id },
          }}
        >
          <a className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
            Play IMdB Known For
          </a>
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
      {/* <button
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
      {data && <KnownFor person={data} />} */}

      <div className="grid items-center grid-cols-12 gap-1 px-4 py-2">
        {/* <div className="aspect-w-3 aspect-h-4"> */}
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
          <h1 className="px-0 text-3xl md:text-6xl text-gray-12">
            {data.name}
          </h1>
          {/* <p className="px-0 -mb-1 text-base md:-mb-0 md:text-lg text-gray-11 line-clamp-5 md:line-clamp-10">
            {data.known_for_department}
          </p> */}
          {data && <KnownFor person={data} />}
          {/* <p className="px-0 -mb-1 text-xs md:-mb-0 md:text-lg text-gray-11 line-clamp-5 md:line-clamp-10">
            {data.biography}
          </p> */}
          {/* <Link
            passHref
            href={{ pathname: "/people/[id]/bio", query: { id: data.id } }}
          >
            <a className="text-sm md:text-lg">more</a>
          </Link> */}
        </div>
      </div>

      <PersonCredits knownForDepartment={data.known_for_department} />
    </div>
  );
}
