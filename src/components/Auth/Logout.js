import React from "react";
// import { Button } from "react-bootstrap";
import Router from "next/router";

const LogoutBtn = ({ logoutHandler }) => (
  <button
    id="qsLogoutBtn"
    variant="primary"
    className="btn-margin logoutBtn"
    onClick={() => Router.push("/api/logout")}
  >
    Log Out
  </button>
);

export default LogoutBtn;
