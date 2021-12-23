import { useMutation } from "react-query";
import { useUser } from "../user-context";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../user-subscription";
import LeaveRoomButton from "../components/LeaveRoomButton";
import Link from "next/link";
// const LeaveRoomButton = () => {
//   const user = useUser();

//   const { mutate, status } = useMutation(["user", "leaveRoom", user.id], () => {
//     return fetch(`/api/leaveRoom?userId=${user.id}`);
//   });
//   return (
//     <button
//       className="button is-danger"
//       disabled={status === "loading"}
//       onClick={() => {
//         mutate();
//       }}
//     >
//       {status === "loading" ? "Leaving Room..." :"Leave Room"}
//     </button>
//   );
// };

const StartGameButton = () => {
  const user = useUser();

  const { mutate, status } = useMutation(
    ["room", "startGame", user.room.name],
    () => {
      return fetch(`/api/startGame?roomName=${user.room.name}`);
    }
  );
  return (
    <button
      className="button"
      disabled={status === "loading"}
      onClick={() => {
        mutate();
      }}
    >
      {status === "loading" ? "Starting game..." :"Everybody's In!"}
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
        {/* <button>Everybody's in!</button> */}
        <StartGameButton />
        <LeaveRoomButton />
      </div>
    </div>
  );
}
