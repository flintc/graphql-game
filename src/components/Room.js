import React from "react";
import RoomScore from "./RoomScore";
import Round from "./Round";
import UserList from "../components/UserList";

const Room = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      {children}
    </div>
  );
};

Room.Round = Round;
Room.Score = RoomScore;
Room.UserList = UserList;
export default Room;
