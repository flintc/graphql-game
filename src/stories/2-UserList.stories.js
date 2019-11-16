import React from "react";
import UserList from "../components/UserList";

export default { title: "UserList" };

export const noResponses = () => {
  return (
    <UserList
      data={[
        { id: 0, name: "GEo" },
        { id: 1, name: "CB" }
      ]}
    />
  );
};

export const oneResponse = () => {
  return (
    <UserList
      data={[
        { id: 0, name: "GEo" },
        { id: 1, name: "CB" }
      ]}
      responses={[{ owner: { id: 1, value: 100 } }]}
    />
  );
};
