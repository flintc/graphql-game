import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useQuery } from "react-query";
import { CreateRoomForm } from "../features/rotten-or-fresh";
import { useUser } from "../shared/user-context";

const Create = () => {
  const { data, loading, error } = useQuery("roomCode", async () => {
    const resp = await fetch("/api/generateRoomCode");
    const data = await resp.json();
    return data;
  });
  return (
    <div className="px-6 mt-6 space-y-4">
      <div className="text-lg font-bold">Create Room:</div>
      {data && <CreateRoomForm roomCode={data.roomCode} />}
    </div>
  );
};

const IndexPage = () => {
  const user = useUser();
  if (user.room) {
    return (
      <div>
        <div>You&apos;re already playing a game!</div>
        <div>
          <button>Leave game</button>
          OR
          <Link href="/">Play</Link>
        </div>
      </div>
    );
  }
  return <Create />;
};

export default IndexPage;
