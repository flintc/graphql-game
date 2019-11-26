import { useQuery } from "@apollo/react-hooks";
import { useContext, useEffect } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
const RoomPage = ({
  match: {
    params: { id }
  }
}) => {
  const { setUser } = useContext(StateContext);
  const { data, loading, error } = useQuery(docs.USER_LOGIN, {
    variables: { id }
  });
  useEffect(() => {
    if (data && !error) {
      setUser(data.user_by_pk);
    }
  }, [data]);
  if (loading) {
    return "Loggin in...";
  }
  if (error) {
    return "User not found :(";
  }
  return null;
};

export default RoomPage;
