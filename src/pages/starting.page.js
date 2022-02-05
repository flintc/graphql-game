import { useMutation } from "react-query";
import { useUser } from "../user-context";
import fetch from "isomorphic-unfetch";
import { useUserSubscription } from "../user-subscription";
import LeaveRoomButton from "../components/LeaveRoomButton";
import Link from "next/link";

const StartGameButton = () => {
  const user = useUser();

  const { mutate, status } = useMutation(
    ["room", "startGame", user?.room?.name],
    () => {
      return fetch(`/api/startGame?roomName=${user?.room?.name}`);
    },
    {
      enabled: user?.room?.name,
    }
  );
  return (
    <button
      className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
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
      <div className="flex flex-col gap-4 px-6 mt-8">
        <h1 className="text-lg font-bold">You are not in a room</h1>
        <div className="grid grid-cols-2">
          <Link href={{ pathname: "/create" }}>
            <a className="px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
              Create
            </a>
          </Link>
          <Link href={{ pathname: "/join" }}>
            <a className="px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
              Join
            </a>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="px-6 mt-6 space-y-4">
      <h1 className="text-lg font-bold">Room Code: {user.room.name}</h1>
      <div className="grid grid-cols-2">
        <LeaveRoomButton />
        <StartGameButton />
      </div>
      <div>
        {user.room.users.map((x) => {
          if (x.id !== user.id) {
            return <p>{x.name}</p>;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
