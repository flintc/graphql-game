import { useMutation } from "react-query";
import Link from "next/link";
import { useMovieScore } from "../../entities/movie";
import { useUserSubscription } from "../../shared/user-subscription";
import fetch from "isomorphic-unfetch";

export function SelectMovie({ movie }) {
  const user = useUserSubscription();
  const { data, status } = useMovieScore(movie);
  const selectQuestionMutation = useMutation("selectQuestion", () => {
    return fetch(`/api/selectQuestion?roomName=${user.room.name}`, {
      method: "POST",
      body: JSON.stringify({
        question: movie.title,
        questionId: movie.id,
        description: movie.overview,
        answer: { value: data.tomatometerScore },
      }),
    });
  });

  return (
    <div className="mt-1">
      {user?.room ? (
        ["loading", "idle"].includes(status) ? (
          "Fetching score..."
        ) : status === "error" ? (
          "Failed to fetch score "
        ) : (
          <button
            className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
            onClick={() => {
              selectQuestionMutation.mutate();
            }}
            disabled={selectQuestionMutation.status !== "idle"}
          >
            Play Rotten or Fresh
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
