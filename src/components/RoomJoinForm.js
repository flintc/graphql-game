import React, { useState } from "react";

const RoomJoinForm = ({ handleSubmit, handleCancel }) => {
  const [code, setCode] = useState(null);
  const [name, setName] = useState(null);
  return (
    <form onSubmit={e => handleSubmit(e, { name, code })}>
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
      <div className="form-field">
        <label htmlFor="room-input" className="form-label">
          ROOM
        </label>
        <input
          id="room-input"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Room Code"
        />
      </div>
      <div className="btn-group">
        <button className="btn" type="button" onClick={handleCancel}>
          go back
        </button>
        <button className="btn">submit</button>
      </div>
    </form>
  );
};

export default RoomJoinForm;
