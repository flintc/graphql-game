import React from "react";
import * as docs from "../documents";
import Room from "../components/Room";
import { useSubscription } from "@apollo/react-hooks";

const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const resp = useSubscription(docs.SUBSCRIBE_TO_ROOM_BY_NAME, {
    variables: { name }
  });
  if (resp.loading) {
    return "Loading...";
  }
  return <Room data={resp.data.room[0]} />;
};

export default RoomPage;
