import { gql, useQuery } from "@apollo/client";
import React, { createContext } from "react";
import Login from "./components/Auth/Login";
import { useFetchUser } from "./lib/user";

const UserContext = createContext();

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

// This default export is required in a new `pages/_app.js` file.
function UserProvider({ children }) {
  const { user, loading, error } = useFetchUser();
  const backendUser = useQuery(GET_USER, {
    skip: !user?.sub,
    variables: {
      userId: user?.sub,
    },
  });
  if (loading || backendUser.loading) {
    return <div>Loading...</div>;
  }
  // debugger;
  if (!loading && !user) {
    // return <Login />;
    <UserContext.Provider value={null}>{children}</UserContext.Provider>;
  } else {
    return (
      <UserContext.Provider value={backendUser.data.user}>
        {children}
      </UserContext.Provider>
    );
  }
  // return null;
  return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
}

const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
};

export { UserProvider, useUser };
