import { useMutation } from "@apollo/react-hooks";
import * as R from "ramda";
import * as L from "partial.lenses";
import { default as React, useContext, useEffect, useState } from "react";
import RoomCreateForm from "../components/RoomCreateForm";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import { useHistory } from "react-router-dom";
import { generateCode } from "../utils";

const RoomCreatePage = () => {
  const history = useHistory();
  const { user, setUser } = useContext(StateContext);
  const [state, setState] = useState({
    userName: undefined,
    roomCode: undefined
  });
  const [createRoom, roomCreated] = useMutation(docs.CREATE_ROOM_MUTATION);
  const [createRoomExistingUser, roomCreatedExistingUser] = useMutation(
    docs.INSERT_ROOM_EXISTING_USER
  );

  useEffect(() => {
    if (user && !user.room) {
      createRoomExistingUser({
        variables: {
          userName: user.name,
          userId: user.id,
          roomName: generateCode()
        }
      });
    }
  }, [user, createRoomExistingUser]);

  useEffect(() => {
    if (roomCreatedExistingUser.data) {
      setUser(
        L.set(
          "room",
          R.pick(
            ["name", "id"],
            roomCreatedExistingUser.data.insert_room.returning[0]
          )
        )
      );
    }
  }, [roomCreatedExistingUser.data, setUser]);

  useEffect(() => {
    if (state.userName && state.roomCode) {
      createRoom({
        variables: { userName: state.userName, roomName: state.roomCode }
      });
    }
  }, [state.roomCode, state.userName, createRoom]);

  useEffect(() => {
    if (roomCreated.data) {
      setUser(roomCreated.data.insert_user.returning[0]);
      localStorage.setItem(
        "userId",
        roomCreated.data.insert_user.returning[0].id
      );
    }
  }, [roomCreated, setUser]);

  const handleSubmit = (e, { name, code }) => {
    e.preventDefault();
    setState(R.mergeLeft({ userName: name, roomCode: code }));
  };

  const handleCancel = () => history.push("/");

  return (
    <RoomCreateForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
  );
};

export default RoomCreatePage;
