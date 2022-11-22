import { useRouter } from "next/router";
import { useMovieScore } from "../../entities/movie/useMovieScore";
import { useTv } from "../../lib/useTv";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../../shared/user-subscription";
import { useMutation } from "react-query";

function SelectMovie({ movie }) {
  const user = useUserSubscription();
  const { data, status } = useMovieScore({
    id: movie.id,
    title: movie.name,
    imdb_id: movie.imdb_id,
  });
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
  return (
    <div>
      {["loading", "idle"].includes(status) && <p>Loading...</p>}
      {["error"].includes(status) && (
        <div>Unable to get scores for this title</div>
      )}
      {status === "success" && (
        <button
          onClick={() => {
            selectQuestionMutation.mutate();
          }}
          disabled={selectQuestionMutation.status === "loading"}
        >
          Select
        </button>
      )}
    </div>
  );
}

export default function MovieDetailsPage() {
  const router = useRouter();
  const { status, data, error } = useTv(router.query.id);
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
        <h1>{data.name}</h1>
        <p>{data.overview}</p>
        <SelectMovie movie={data} />
      </div>
    </div>
  );
}
