import { useRouter } from "next/router";
import { useUpsertRoomWithUser } from "../../entities/room";
import { useUser } from "../../shared/user-context";

export const JoinRoomForm = ({ roomCode }) => {
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
            roomName: e.target.elements.roomCode.value.toUpperCase(),
            userId: user.id,
            userName: e.target.elements.nickname.value,
          },
          onCompleted: () => {
            router.push("/");
          },
        });
      }}
    >
      <input className="uppercase" id="roomCode" placeholder="Room Code" />
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
          className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
          disabled={loading || error}
        >
          {loading ? "Submitting..." :"Submit"}
        </button>
      </div>
    </form>
  );
};
