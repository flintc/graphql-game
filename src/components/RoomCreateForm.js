import React, { useState } from "react";
import { generateCode } from "../utils";

const RoomCreateForm = ({ handleSubmit, handleCancel }) => {
  const [name, setName] = useState(null);
  const code = generateCode();
  return (
    <form onSubmit={e => handleSubmit(e, { name, code })}>
      <div className="form-field">
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
      <div className="btn-group">
        <button onClick={handleCancel} type="button" className="btn">
          go back
        </button>
        <button className="btn">submit</button>
      </div>
    </form>
  );
};

export default RoomCreateForm;
