import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const StateContext = React.createContext({
  user: {
    id: "fake-user",
    name: "fake user"
  }
});

export const StateProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState();
  useEffect(() => {
    if (user) {
      if (user.room) {
        history.push(`/room/${user.room.name}`);
      } else {
        history.push("/");
      }
    } else if (localStorage.getItem("userId")) {
      history.push(`/login/${localStorage.getItem("userId")}`);
    }
  }, [user, history]);
  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};
