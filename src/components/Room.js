import React from "react";
import UserList from "../components/UserList";

const Room = ({ children }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      {children}
    </div>
  );
};

Room.UserList = UserList;
export default Room;
