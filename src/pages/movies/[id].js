/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useMovieScore } from "../../lib/useMovieScore";
import { useMovie } from "../../lib/useMovie";
import { useGenres } from "../../lib/useGenres";
import { useMovieCredits } from "../../lib/useMovieCredits";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../../user-subscription";
import { useMutation } from "react-query";
import Link from "next/link";
import { GENRE_LUT } from "../../constants";
import { useKeywords } from "../../lib/useKeywords";
import { motion } from "framer-motion";
import ScrollArea from "../../components/ScrollArea";
import { useMediaWatchProviders } from "../../lib/useMediaWatchProviders";

function WatchProviders({ movieId }) {
  const { data, status } = useMediaWatchProviders(movieId);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }
  console.log("data watch", data);
  return (
    <div className="px-2 py-2">
      <div className="text-gray-12">Where To Watch</div>
      {data?.flatrate?.length > 0 && (
        <div className="text-gray-11">Streaming</div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.flatrate?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      {data?.buy?.length > 0 && <div className="text-gray-11">Buy</div>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.buy?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      {data?.rent?.length > 0 && <div className="text-gray-11">Rent</div>}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(3rem,1fr))] gap-1">
        {data?.rent?.map((provider) => {
          return (
            <img
              alt="foo"
              key={provider.provider_id}
              // className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
              className="w-12 h-12 rounded-md"
              src={`https://image.tmdb.org/t/p/original/${provider.logo_path}`}
            />
          );
        })}
      </div>
      <div className="py-2 text-sm text-gray-11">
        Brought to you by JustWatch
      </div>
    </div>
  );
}

function SelectMovie({ movie }) {
  const user = useUserSubscription();
  const { data, status } = useMovieScore(movie);
  const selectQuestionMutation = useMutation("selectQuestion", () => {
    return fetch(`/api/selectQuestion?roomName=${user.room.name}`, {
      method: "POST",
      body: JSON.stringify({
        question: movie.title,
        description: movie.overview,
        answer: { value: data.tomatometerScore },
      }),
    });
  });
  // const out = useMovieReviews(movie.id);
  return (
    <div className="mt-1">
      {user?.room ? (
        status === "loading" ? (
          "Fetching score..."
        ) : status === "error" ? (
          "Failed to fetch score "
        ) : (
          <button
            className="px-8 py-2 font-medium text-white rounded-lg bg-primary-9 "
            onClick={() => {
              selectQuestionMutation.mutate();
            }}
            disabled={selectQuestionMutation.status === "loading"}
          >
            Select
          </button>
        )
      ) : (
        <Link
          href={{
            pathname: "/game/rottenOrFresh/movie/[id]",
            query: { id: movie.id },
          }}
        >
          <a className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
            Play Rotten or Fresh
          </a>
        </Link>
      )}
    </div>
  );
}

function MovieKeywords({ movie }) {
  const { data, status } = useKeywords(movie.id);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Unable to get keywords for this title</p>;
  }

  return (
    <div className="px-2 mt-2">
      <div className="font-medium uppercase text-gray-12 ">Keywords:</div>
      <div className="flex flex-wrap justify-start gap-2 mt-2 text-sm text-gray-11">
        {data.keywords.map((keyword) => {
          return (
            <Link
              key={keyword.id}
              href={{
                pathname: "/movies/browse",
                query: { with_keywords: `${keyword.id}` },
              }}
            >
              <a className="px-1.5 py-0.5 rounded-lg bg-gray-3">
                {keyword.name}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const Credits = ({ movieId }) => {
  const { data, status } = useMovieCredits(movieId);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Unable to get credits for this title</p>;
  }
  return (
    <div className="px-2 mt-3">
      <ScrollArea>
        <div className="grid w-full grid-flow-col gap-2 auto-cols-max ">
          {data.cast.map((cast) => {
            return (
              <Link
                key={cast.id}
                href={{
                  pathname: "/people/[id]",
                  query: { id: `${cast.id}` },
                }}
              >
                <a className="px-1.5 py-0.5 rounded-lg block w-full">
                  <div className="flex w-full flex-nowrap">
                    <img
                      alt="foo"
                      className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
                      src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                    />
                    <span className="w-full">{cast.name}</span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default function MovieDetailsPage() {
  const router = useRouter();
  const { status, data, error } = useMovie(router.query.id);
  console.log("useMovie data", status, data);
  const genresQuery = useGenres();
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
            <div className="absolute flex justify-around gap-2 overflow-x-scroll flex-nowrap bottom-2 left-2">
              {data?.genres?.map((genre) => {
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
                      {genresQuery?.data?.[genre.id]}
                    </a>
                  </Link>
                );
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
        {/* <h1>{data.title}</h1>
        <p>{data.overview}</p> */}
        <MovieKeywords movie={data} />
        <Credits movieId={data.id} />
        <WatchProviders movieId={data.id} />
      </div>
    </div>
  );
}
