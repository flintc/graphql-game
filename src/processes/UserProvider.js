import { gql, useQuery } from "@apollo/client";
import React from "react";
import { useFetchUser } from "../shared/user";
import { UserContext } from "../shared/user-context";

const GET_USER = gql`
  query User($userId: String!) {
    user: user_by_pk(id: $userId) {
      id
      name
      starred
      room {
        state
        id
        name
      }
    }
  }
`;

export default function UserProvider({ children }) {
  const { user, loading, error } = useFetchUser();
  const backendUser = useQuery(GET_USER, {
    skip: !user?.sub,
    variables: {
      userId: user?.sub,
    },
  });
  console.log("UserProvider", backendUser);
  if (loading || backendUser.loading) {
    return <div>Loading...</div>;
  }
  if (!loading && !user) {
    <UserContext.Provider value={null}>{children}</UserContext.Provider>;
  } else {
    return (
      <UserContext.Provider value={backendUser.data.user}>
        {children}
      </UserContext.Provider>
    );
  }
  return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
}
