import Link from "next/link";
import { JoinRoomForm } from "../features/rotten-or-fresh";
import { useUser } from "../shared/user-context";

const Join = () => {
  return (
    <div className="px-6 mt-6 space-y-4">
      <div className="text-lg font-bold">Join Room:</div>
      <JoinRoomForm />
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
  return <Join />;
};

export default IndexPage;
