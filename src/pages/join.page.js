import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { createMachine } from "xstate";
import { useUpsertRoomWithUser } from "../lib/useUpsertRoomWithUser";
import { useUser } from "../user-context";

const CreateRoomForm = ({ roomCode }) => {
  const user = useUser();
  const router = useRouter();
  const [upsertRoomWithUser, { data, loading, called, error }] =
    useUpsertRoomWithUser({
      onCompleted: (data) => {
        router.push("/");
      },
    });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        upsertRoomWithUser({
          variables: {
            roomName: e.target.elements.roomCode.value,
            userId: user.id,
            userName: e.target.elements.nickname.value,
          },
          onCompleted: () => {
            router.push("/");
          },
        });
      }}
    >
      <input id="roomCode" placeholder="Room Code" />
      <input id="nickname" placeholder="Name" defaultValue={user.name} />
      <button
        type="button"
        onClick={() => {
          router.back();
        }}
      >
        Cancel
      </button>
      <button disabled={loading || error}>
        {loading ? "Submitting..." :"Submit"}
      </button>
    </form>
  );
};

const Create = () => {
  // const { data, loading, error } = useQuery("roomCode", async () => {
  //   const resp = await fetch("/api/generateRoomCode");
  //   const data = await resp.json();
  //   return data;
  // });
  return (
    <div>
      join room page
      <CreateRoomForm />
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
