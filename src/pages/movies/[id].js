import { useRouter } from "next/router";
import { useMovieScore } from "../../lib/useMovieScore";
import { useMovie } from "../../lib/useMovie";
import { useGenres } from "../../lib/useGenres";
import { useMovieReviews } from "../../lib/useMovieReviews";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../../user-subscription";
import { useMutation } from "react-query";
import Link from "next/link";
import { GENRE_LUT } from "../../constants";
import { useKeywords } from "../../lib/useKeywords";
import { motion } from "framer-motion";

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
      {/* {["loading", "idle"].includes(status) && <p>Loading...</p>} */}
      {/* {["error"].includes(status) && (
        <div>Unable to get scores for this title</div>
      )} */}
      {user.room ? (
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
          <a className="px-4 py-2 text-gray-12">Guess the score!</a>
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

export default function MovieDetailsPage() {
  const router = useRouter();
  const { status, data, error } = useMovie(router.query.id);
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
                  <span
                    key={genre.id}
                    className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                    style={{
                      borderColor: `var(--${GENRE_LUT[genre.id]}7)`,
                      backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
                      color: `var(--${GENRE_LUT[genre.id]}12)`,
                    }}
                  >
                    {genresQuery?.data?.[genre.id]}
                  </span>
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
      </div>
    </div>
  );
}
