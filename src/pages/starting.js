import { useMutation } from "react-query";
import { useUser } from "../user-context";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../user-subscription";

import Link from "next/link";
const LeaveRoomButton = () => {
  const user = useUser();

  const { mutate, status } = useMutation(["user", "leaveRoom", user.id], () => {
    return fetch(`/api/leaveRoom?userId=${user.id}`);
  });
  return (
    <button
      className="button is-danger"
      disabled={status === "loading"}
      onClick={() => {
        mutate();
      }}
    >
      {status === "loading" ? "Leaving Room..." : "Leave Room"}
    </button>
  );
};

export default function StartingPage() {
  const user = useUserSubscription();
  if (!user.room) {
    return (
      <div>
        <h1>You are not in a room</h1>
        <Link href={{ pathname: "/create" }}>Create</Link>
        <button>Join</button>
      </div>
    );
  }
  return (
    <div>
      <h1>Starting Page</h1>
      <div>
        <button>Everybody's in!</button>
        <LeaveRoomButton />
      </div>
    </div>
  );
}
