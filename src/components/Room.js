import * as R from "ramda";
import React from "react";
import RoomScore from "./RoomScore";
import UserList from "./UserList";
import Round from "./Round";

const Room = ({ data }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      <Round
        data={data.questions[data.round]}
        roomId={data.id}
        nUsers={data.users.length}
      />
      <RoomScore data={data.questions} />
      <UserList
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
};

export default Room;
