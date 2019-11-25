import React, { useState, useContext } from "react";
import * as R from "ramda";

const Context = React.createContext();

const RoomJoinNameInput = () => {
  const { name, setName } = useContext(Context);
  return (
    <div className="form-field" j>
      <label htmlFor="name-input" className="form-label">
        NAME
      </label>
      <input
        id="name-input"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
    </div>
  );
};

const RoomJoinCodeInput = () => {
  const { code, setCode } = useContext(Context);
  return (
    <div className="form-field">
      <label htmlFor="room-input" className="form-label">
        ROOM
      </label>
      <input
        id="room-input"
        value={code}
        onChange={e => setCode(R.toUpper(e.target.value))}
        placeholder="Room Code"
      />
    </div>
  );
};

const RoomJoinForm = ({
  children,
  handleSubmit,
  handleCancel,
  roomCode = null,
  userName = null
}) => {
  const [code, setCode] = useState(roomCode);
  const [name, setName] = useState(userName);
  return (
    <Context.Provider value={{ code, setCode, name, setName }}>
      <form onSubmit={e => handleSubmit(e, { name, code })}>
        {children}
        {/* <div className="form-field" j>
        <label htmlFor="name-input" className="form-label">
          NAME
        </label>
        <input
          id="name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div className="form-field">
        <label htmlFor="room-input" className="form-label">
          ROOM
        </label>
        <input
          id="room-input"
          value={code}
          onChange={e => setCode(R.toUpper(e.target.value))}
          placeholder="Room Code"
        />
      </div> */}
        <div className="btn-group">
          <button className="btn" type="button" onClick={handleCancel}>
            go back
          </button>
          <button className="btn">submit</button>
        </div>
      </form>
    </Context.Provider>
  );
};

RoomJoinForm.NameInput = RoomJoinNameInput;
RoomJoinForm.CodeInput = RoomJoinCodeInput;

export default RoomJoinForm;
