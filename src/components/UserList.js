import * as L from "partial.lenses";
import React from "react";

const UserList = ({ data, responses }) => {
  return (
    <div className="fixed bottom-0 left-0 w-screen overflow-auto whitespace-no-wrap pb-2 px-4 text-center">
      {data.map(user => {
        const answered = L.get(
          [L.whereEq({ owner: { id: user.id } })],
          responses
        );
        const cls = answered
          ? "badge px-6 py-2 mr-4 inline-block"
          : "badge-gray px-6 py-2 mr-4 inline-block";
        console.log(cls);
        console.log("answered?", user, responses, answered);
        return (
          <span className={cls} key={user.id}>
            {user.name}
          </span>
        );
      })}
    </div>
  );
};

export default UserList;
