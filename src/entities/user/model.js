import { useMutation } from "react-query";
import { useUser } from "../shared/user-context";
import fetch from "isomorphic-unfetch";

// const user = useUser();

// const { mutate, status } = useMutation(["user", "leaveRoom", user.id], () => {
//   return fetch(`/api/leaveRoom?userId=${user.id}`);
// });

const leaveRoom = (userId) => {
  fetch(`/api/leaveRoom?userId=${user.id}`);
};
