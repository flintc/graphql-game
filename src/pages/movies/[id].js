import { useRouter } from "next/router";
import { useMovieScore } from "../../lib/useMovieScore";
import { useMovie } from "../../lib/useMovie";
import { useMovieReviews } from "../../lib/useMovieReviews";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../../user-subscription";
import { useMutation } from "react-query";
import Link from "next/link";

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
  const out = useMovieReviews(movie.id);
  return (
    <div>
      {/* {["loading", "idle"].includes(status) && <p>Loading...</p>} */}
      {/* {["error"].includes(status) && (
        <div>Unable to get scores for this title</div>
      )} */}
      {status === "success" && user.room ? (
        <button
          onClick={() => {
            selectQuestionMutation.mutate();
          }}
          disabled={selectQuestionMutation.status === "loading"}
        >
          Select
        </button>
      ) : (
        <Link
          href={{
            pathname: "/game/rottenOrFresh/movie/[id]",
            query: { id: movie.id },
          }}
        >
          Guess the score!
        </Link>
      )}
    </div>
  );
}

export default function MovieDetailsPage() {
  const router = useRouter();
  const { status, data, error } = useMovie(router.query.id);
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
      details!
      <div key={data.id}>
        <h1>{data.title}</h1>
        <p>{data.overview}</p>
        <SelectMovie movie={data} />
      </div>
    </div>
  );
}
