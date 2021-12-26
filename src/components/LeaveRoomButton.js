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
      // className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
      className="block w-full px-4 py-2 text-center border rounded-md bg-gray-1 border-gray-7 text-gray-12"
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
