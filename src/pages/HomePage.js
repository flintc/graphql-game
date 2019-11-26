import { useHistory } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { StateContext } from "../app-state";

const HomePage = () => {
  const [state, setState] = useState();
  const { user } = useContext(StateContext);
  const history = useHistory();
  useEffect(() => {
    if (state === "join") {
      history.push("/join");
    } else if (state === "create") {
      history.push("/create");
    }
  }, [state, history]);
  return (
    <div className="px-10">
      <h1>{user ? `${user.name}, d` : "D"}o you want to play a game?</h1>
      <div className="btn-group">
        <button className="btn" onClick={() => setState("create")}>
          create
        </button>
        <button className="btn" onClick={() => setState("join")}>
          join
        </button>
      </div>
    </div>
  );
};

export default HomePage;
