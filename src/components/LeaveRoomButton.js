import { useMutation } from "react-query";
import { useUser } from "../user-context";
import fetch from "isomorphic-unfetch";

const LeaveRoomButton = () => {
  const user = useUser();

  const { mutate, status } = useMutation(["user", "leaveRoom", user.id], () => {
    return fetch(`/api/leaveRoom?userId=${user.id}`);
  });
  return (
    <button
      className="px-8 py-2 font-medium text-white rounded-lg bg-primary-9 "
      disabled={status === "loading"}
      onClick={() => {
        mutate();
      }}
    >
      {status === "loading" ? "Leaving Room..." :"Leave Room"}
    </button>
  );
};

export default LeaveRoomButton;
