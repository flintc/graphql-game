import fetch from "isomorphic-unfetch";
import { useMutation } from "react-query";
import { useUserSubscription } from "../user-subscription";

export default function RevealingPage() {
  const user = useUserSubscription();
  const { mutate, loading, error } = useMutation("nextRound", () => {
    return fetch(`/api/nextRound?roomName=${user.room.name}`);
  });
  return (
    <div>
      <h1>Revealing</h1>
      <div>
        <button
          disabled={loading || error}
          onClick={() => {
            mutate();
          }}
        >
          Next round
        </button>
      </div>
    </div>
  );
}
