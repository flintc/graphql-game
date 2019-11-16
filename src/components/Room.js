import * as L from "partial.lenses";
import * as R from "ramda";
import React, { useContext } from "react";
import RoomScore from "./RoomScore";
import Round from "./Round";
import UserList from "./UserList";
import { StateContext } from "../app-state";

const Room = ({ data }) => {
  const { user } = useContext(StateContext);
  const questions = L.collect([
    L.elems,
    L.pick({
      answer: ["answer", "score", "rottenTomatoes"],
      response: {
        value: ["responses", L.whereEq({ owner: { id: user.id } }), "value"]
      }
    })
  ])(data.questions);
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      <Round
        data={data.questions[data.round]}
        roomId={data.id}
        nUsers={data.users.length}
      />
      <RoomScore data={questions} />
      <UserList
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
};

export default Room;
