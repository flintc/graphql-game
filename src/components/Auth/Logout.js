import React from "react";
// import { Button } from "react-bootstrap";
import Router from "next/router";

const LogoutBtn = ({ logoutHandler }) => (
  <button
    id="qsLogoutBtn"
    variant="primary"
    // className="btn-margin logoutBtn"
    className="block w-full px-4 py-2 text-center border rounded-md bg-gray-1 border-gray-7 text-gray-12"
    onClick={() => Router.push("/api/logout")}
  >
    Log Out
  </button>
);

export default LogoutBtn;
