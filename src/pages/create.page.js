import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { createMachine } from "xstate";
import { useUpsertRoomWithUser } from "../lib/useUpsertRoomWithUser";
import { useUser } from "../user-context";

const startGameMachine = createMachine({
  id: "startGame",
  initial: "idle",
  states: {
    idle: { on: { CREATE: "creating", JOIN: "joining" } },
    joining: {},
    creating: {},
  },
});

function generateRoomCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

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
            // roomName: e.target.elements.roomCode.value,
            roomName: roomCode,
            userId: user.id,
            userName: e.target.elements.nickname.value,
          },
          onCompleted: () => {
            router.push("/");
          },
        });
      }}
    >
      {/* <input id="roomCode" defaultValue={roomCode} disabled /> */}
      <input id="nickname" placeholder="Name" defaultValue={user.name} />
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => {
            router.back();
          }}
          className="block w-full px-4 py-2 text-center border rounded-md bg-gray-1 border-gray-7 text-gray-12"
        >
          Cancel
        </button>
        <button
          disabled={loading || error}
          className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
        >
          {loading ? "Submitting..." :"Submit"}
        </button>
      </div>
    </form>
  );
};

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
