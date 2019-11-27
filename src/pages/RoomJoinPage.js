import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import * as R from "ramda";
import { default as React, useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import RoomJoinForm from "../components/RoomJoinForm";
import { useHistory } from "react-router-dom";
import * as L from "partial.lenses";

const useExistingUserLogic = ({ userId, roomId }) => {
  const [userJoinRoom, resp] = useMutation(
    docs.EXISTING_USER_JOIN_ROOM_MUTATION
  );
  useEffect(() => {
    if (roomId && userId) {
      userJoinRoom({ variables: { id: userId, roomId: roomId } });
    }
  }, [roomId, userId, userJoinRoom]);
  return L.get(["data", "update_user", "returning", 0], resp);
};

const useNewUserLogic = ({ userName, roomId }) => {
  const [createUserAndJoinRoom, resp] = useMutation(docs.JOIN_ROOM_MUTATION);
  useEffect(() => {
    if (roomId && userName) {
      createUserAndJoinRoom({
        variables: { name: userName, roomId: roomId }
      });
    }
  }, [roomId, userName, createUserAndJoinRoom]);
  return L.get(["data", "insert_user", "returning", 0], resp);
};

const RoomJoinPage = () => {
  const history = useHistory();
  const { user, setUser } = useContext(StateContext);
  const [state, setState] = useState({
    userName: undefined,
    roomCode: undefined,
    roomId: undefined
  });
  const [queryRoom, roomQuery] = useLazyQuery(docs.ROOM_BY_NAME_QUERY);

  useEffect(() => {
    if (state.roomCode) {
      queryRoom({ variables: { name: state.roomCode } });
    }
  }, [state.roomCode, queryRoom]);

  useEffect(() => {
    if (!roomQuery.loading) {
      if (roomQuery.data && roomQuery.data.room.length) {
        setState(R.mergeLeft({ roomId: roomQuery.data.room[0].id }));
      }
    }
  }, [roomQuery]);

  const newUserData = useNewUserLogic(state);
  const existingUserData = useExistingUserLogic({
    userId: L.get("id", user),
    ...state
  });

  const userData = user ? existingUserData : newUserData;

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  const handleSubmit = (e, { name, code }) => {
    e.preventDefault();
    setState(R.mergeLeft({ userName: name, roomCode: code }));
  };

  const handleCancel = () => history.push("/");

  return (
    <RoomJoinForm
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      userName={user && user.name}
    >
      {!user && <RoomJoinForm.NameInput />}
      <RoomJoinForm.CodeInput />
    </RoomJoinForm>
  );
};

export default RoomJoinPage;
