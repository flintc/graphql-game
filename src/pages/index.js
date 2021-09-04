import { gql, useSubscription } from "@apollo/client";
import Link from "next/link";
import { useUser } from "../user-context";
import { useUserSubscription } from "../user-subscription";

const START_GAME = gql`
  mutation StartGame($roomName: String!) {
    update_room(
      where: { name: { _eq: $roomName } }
      _set: { state: "selecting" }
    ) {
      affected_rows
    }
  }
`;

const CreateOrJoin = () => {
  return (
    <div>
      <Link href={{ pathname: "/create" }}>Create</Link>
      <button>Join</button>
    </div>
  );
};

const PlayStarting = () => {
  const [startGame, { data, loading, error }] = useMutation(START_GAME, {
    variables: {
      roomName: "test",
    },
  });
  return (
    <div>
      <button>Everybody's in</button>
    </div>
  );
};

const ROOM_SUBSCRIPTION = gql`
  subscription Room($roomId: uuid!) {
    room: room_by_pk(id: $roomId) {
      state
    }
  }
`;

const Play = ({ room }) => {
  const user = useUserSubscription();

  if (user.room.state === "selecting") {
    return <div>select a movie</div>;
  }
  if (user.room.state === "starting") {
    return <PlayStarting />;
  }
  return <div>You're in a room, cool!</div>;
};

const IndexPage = () => {
  const user = useUser();
  return (
    <div>
      home page
      <CreateOrJoin />
      {/* {user?.room ? <Play room={user.room} /> : <CreateOrJoin />} */}
    </div>
  );
};

export default IndexPage;
