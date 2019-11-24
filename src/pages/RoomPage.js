import { useSubscription } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext } from "react";
import { StateContext } from "../app-state";
import Room from "../components/Room";
import * as docs from "../documents";
import * as R from "ramda";
const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(StateContext);
  const resp = useSubscription(docs.SUBSCRIBE_TO_ROOM_BY_NAME, {
    variables: { name }
  });
  if (resp.loading) {
    return "Loading...";
  }
  const room = resp.data.room[0];
  const questions = L.collect([
    L.elems,
    L.pick({
      answer: ["answer", "score", "rottenTomatoes"],
      response: {
        value: ["responses", L.whereEq({ owner: { id: user.id } }), "value"]
      }
    })
  ])(room.questions);
  return (
    <Room>
      <Room.Round
        data={room.questions[room.round]}
        roomId={room.id}
        nUsers={room.users.length}
      />
      <Room.Score data={questions} />
      <Room.UserList
        data={room.users}
        responses={R.propOr([], "responses", room.questions[room.round])}
      />
    </Room>
  );
};

export default RoomPage;
