import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const StateContext = React.createContext();

export const StateProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState();
  useEffect(() => {
    if (user) {
      console.log("user changed", user);
      if (user.room) {
        history.push(`/room/${user.room.name}`);
      } else {
        history.push("/");
      }
    }
  }, [user]);
  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};
