import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const StateContext = React.createContext();

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
    }
  }, [user, history]);
  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};
