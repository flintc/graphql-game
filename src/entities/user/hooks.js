import { useMutation } from "react-query";
import { useUser } from "../shared/user-context";
import * as model from "./model";

export const useLeaveRoom = () => {
  const user = useUser();

  const { mutate, status } = useMutation(["user", "leaveRoom", user.id], () => {
    return model.leaveRoom(user.id);
  });
  return { mutate, status };
};
