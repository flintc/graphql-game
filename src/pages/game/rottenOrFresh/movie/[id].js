/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import { useState } from "react";
import { useMovie } from "../../../../lib/useMovie";
import { useGenres } from "../../../../lib/useGenres";
import { useMovieScore } from "../../../../lib/useMovieScore";
import { motion } from "framer-motion";
import { GENRE_LUT } from "../../../../constants";

const getAnswerByScoreType = (scores, scoreType) => {
  if (scoreType === "critics") {
    return scores["tomatometerScore"];
  } else if (scoreType === "audience") {
    return scores["audienceScore"];
  } else if (scoreType === "the-spread") {
    return scores["tomatometerScore"] - scores["audienceScore"];
  }
};

function RottenOrFreshAnswer({ movie, guess }) {
  console.warn("!!!!! imdbid??", movie);
  const { data, status, error } = useMovieScore(movie);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    console.warn("errror", error);
    return <p>Error!</p>;
  }
  const answer = getAnswerByScoreType(data, guess["scoreType"]);
  return (
    <div>
      <div>Your guess: {guess.value}</div>
      <div>
        Answer ({guess["scoreType"]}): {answer}
        {guess["scoreType"] === "the-spread" && (
          <div>
            Critics rated this movie {answer > 0 ? "better" : "worse"} than the
            audience by {Math.abs(answer)} points
          </div>
        )}
        {/* <div>{JSON.stringify(data)}</div> */}
      </div>
    </div>
  );
}

export default function RottenOrFreshPage() {
  const router = useRouter();
  const { status, data, error } = useMovie(router.query.id);
  const [guess, setGuess] = useState(null);
  const genres = useGenres();
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div>
        <div className="relative">
          <div className="absolute flex gap-2 bottom-2 left-2">
            {data?.genres?.map((genre) => {
              return (
                <span
                  key={genre.id}
                  className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
                  style={{
                    borderColor: `var(--${GENRE_LUT[genre.id]}10)`,
                    backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
                    color: `var(--${GENRE_LUT[genre.id]}11)`,
                  }}
                >
                  {genre.name}
                </span>
              );
            })}
          </div>
          <img
            alt={data.title}
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
          <p className="mt-2 text-sm text-gray-11">{data?.overview}</p>
        </div>

        {guess ? (
          <RottenOrFreshAnswer movie={data} guess={guess} />
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const scoreType = e.target.elements?.["score-type"];
              setGuess({
                value: e.target.elements.answer.value,
                scoreType: scoreType.value,
              });
            }}
          >
            <motion.div
              initial={{ opacity: 1, translateX: "-100%" }}
              animate={{
                opacity: 1,
                width: "auto",
                translateX: "0%",
              }}
              exit={{ opacity: 1, width: 0 }}
              // transition={{ duration: 2 }}
              className="flex gap-0 px-1 py-2"
            >
              <input
                className="rounded-r-none"
                id="answer"
                placeholder="Your guess"
              />
              <button className="px-4 py-2 border rounded-lg rounded-l-none bg-primary-3 text-primary-11 border-primary-6">
                submit
              </button>
            </motion.div>
            <fieldset className="flex gap-4 px-2">
              <legend className="mb-1.5 text-gray-12">Score source:</legend>
              <div className="flex items-center gap-2 text-gray-12">
                <input
                  type="radio"
                  id="score-type_critics"
                  name="score-type"
                  value="critics"
                  className="text-primary-9 focus:ring-1 focus:ring-primary-9 focus:ring-offset-gray-2"
                  defaultChecked={true}
                />
                <label htmlFor="score-type_critics" className="">
                  Critics
                </label>
              </div>
              <div className="flex items-center gap-2 text-gray-12 flex-nowrap">
                <input
                  type="radio"
                  id="score-type_audience"
                  name="score-type"
                  value="audience"
                  className="text-primary-9 focus:ring-1 focus:ring-primary-9 focus:ring-offset-gray-2"
                  defaultChecked={false}
                />
                <label htmlFor="score-type_audience">Audience</label>
              </div>
              <div className="flex items-center gap-2 text-gray-12 flex-nowrap">
                <input
                  type="radio"
                  name="score-type"
                  value="the-spread"
                  id="score-type_spread"
                  className="text-primary-9 focus:ring-1 focus:ring-primary-9 focus:ring-offset-gray-2"
                  defaultChecked={false}
                />
                <label htmlFor="score-type_spread">The Spread</label>
              </div>
            </fieldset>
          </form>
        )}
      </div>
    </div>
  );
}
