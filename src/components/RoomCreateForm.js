import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { generateCode } from "../utils";

const RoomCreateForm = ({ handleSubmit, handleCancel }) => {
  const [name, setName] = useState(null);
  const code = generateCode();
  const history = useHistory();
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
        <button
          onClick={() => {
            history.push("/");
          }}
          className="btn"
        >
          go back
        </button>
        <button className="btn" type="button" onClick={handleCancel}>
          submit
        </button>
      </div>
    </form>
  );
};

export default RoomCreateForm;
