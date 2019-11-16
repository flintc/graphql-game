import { useMutation } from "@apollo/react-hooks";
import * as R from "ramda";
import { default as React, useContext, useEffect, useState } from "react";
import RoomCreateForm from "../components/RoomCreateForm";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import { useHistory } from "react-router-dom";

const RoomCreatePage = () => {
  const history = useHistory();
  const { setUser } = useContext(StateContext);
  const [state, setState] = useState({
    userName: undefined,
    roomCode: undefined
  });
  const [createRoom, roomCreated] = useMutation(docs.CREATE_ROOM_MUTATION);
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
    }
  }, [roomCreated, setUser]);

  const handleSubmit = (e, { name, code }) => {
    e.preventDefault();
    console.log("here/");
    setState(R.mergeLeft({ userName: name, roomCode: code }));
  };

  const handleCancel = () => history.push("/");

  return (
    <RoomCreateForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
  );
};

export default RoomCreatePage;
