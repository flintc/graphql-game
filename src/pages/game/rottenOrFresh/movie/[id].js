import { useRouter } from "next/router";
import { useState } from "react";
import { useMovie } from "../../../../lib/useMovie";
import { useMovieScore } from "../../../../lib/useMovieScore";

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
  const { data, status } = useMovieScore(movie);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error!</p>;
  }
  const answer = getAnswerByScoreType(data, guess["scoreType"]);
  return (
    <div>
      <div>You're guess: {guess.value}</div>
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
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h1>Guess the score</h1>
      <div>
        <h1>{data?.title}</h1>
        <p>{data?.description}</p>
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
            <fieldset>
              <legend>Score source:</legend>
              <label>
                Critics
                <input
                  type="radio"
                  id="score-type_critics"
                  name="score-type"
                  value="critics"
                  defaultChecked={true}
                />
              </label>
              <label>
                Audience
                <input
                  type="radio"
                  id="score-type_audience"
                  name="score-type"
                  value="audience"
                  defaultChecked={false}
                />
              </label>
              <label>
                The Spread
                <input
                  type="radio"
                  name="score-type"
                  value="the-spread"
                  id="score-type_spread"
                  defaultChecked={false}
                />
              </label>
            </fieldset>
            <input id="answer" placeholder="Your guess" />
            <button>submit answer</button>
          </form>
        )}
      </div>
    </div>
  );
}
