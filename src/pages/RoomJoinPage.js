import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import * as R from "ramda";
import { default as React, useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import RoomJoinForm from "../components/RoomJoinForm";
import { useHistory } from "react-router-dom";

const RoomJoinPage = () => {
  const history = useHistory();
  const { setUser } = useContext(StateContext);
  const [state, setState] = useState({
    userName: undefined,
    roomCode: undefined,
    roomId: undefined
  });
  const [queryRoom, roomQuery] = useLazyQuery(docs.ROOM_BY_NAME_QUERY);
  const [joinRoom, roomJoined] = useMutation(docs.JOIN_ROOM_MUTATION);

  useEffect(() => {
    if (state.roomCode) {
      queryRoom({ variables: { name: state.roomCode } });
    }
  }, [state.roomCode]);

  useEffect(() => {
    if (!roomQuery.loading) {
      if (roomQuery.data && roomQuery.data.room.length) {
        setState(R.mergeLeft({ roomId: roomQuery.data.room[0].id }));
      }
    }
  }, [roomQuery]);

  useEffect(() => {
    if (state.roomId && state.userName) {
      joinRoom({ variables: { name: state.userName, roomId: state.roomId } });
    }
  }, [state.roomId, state.userName, joinRoom]);

  useEffect(() => {
    if (roomJoined.data) {
      setUser(roomJoined.data.insert_user.returning[0]);
    }
  }, [roomJoined.data, setUser]);

  const handleSubmit = (e, { name, code }) => {
    e.preventDefault();
    setState(R.mergeLeft({ userName: name, roomCode: code }));
  };

  const handleCancel = () => history.push("/");

  return (
    <RoomJoinForm handleSubmit={handleSubmit} handleCancel={handleCancel} />
  );
};

export default RoomJoinPage;
