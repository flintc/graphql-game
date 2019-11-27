import { useSubscription } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext, useState } from "react";
import { StateContext } from "../app-state";
import Room from "../components/Room";
import * as docs from "../documents";
import * as R from "ramda";
import { Link } from "@reach/router";
const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(StateContext);
  const [roundOver, setRoundOver] = useState(false);
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
  const round = room.questions[room.round];
  // TODO: maybe transform users to include bool for hasAnswer in the component instead of
  // Room.UserList, that way we don't have to pass down responses
  return (
    <Room>
      <span className="fixed top-0 my-2 inline-flex">
        <h1>
          {room.name} -{" "}
          <Link
            className="text-blue-700 hover:text-blue-400"
            to={`/#/login/${user.id}`}
          >
            your login link
          </Link>
        </h1>
      </span>
      <Room.Round
        data={round}
        roomId={room.id}
        nUsers={room.users.length}
        roundOver={roundOver}
        setRoundOver={setRoundOver}
      />
      {!(L.get("answer", round) && roundOver) && (
        <Room.Score data={questions} />
      )}
      <Room.UserList
        data={room.users}
        responses={R.propOr([], "responses", room.questions[room.round])}
      />
    </Room>
  );
};

export default RoomPage;
