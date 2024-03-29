import { gql, useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import React, { createContext, useEffect } from "react";
import { Drawer } from "./components/drawer";
import GuessingPage from "./pages/guessing.page";
import RevealingPage from "./pages/revealing.page";
import StartingPage from "./pages/starting.page";
import { useUser } from "./user-context";
export const UserSubscriptionContext = createContext();

export const SUBSCRIBE_TO_USER = gql`
  subscription User($userId: String!) {
    user: user_by_pk(id: $userId) {
      id
      name
      starred
      room {
        state
        id
        name
        round
        users {
          id
          name
        }
        questions(order_by: { created_at: asc_nulls_last }) {
          id
          name
          questionId
          description
          answer
          responses(order_by: { created_at: desc_nulls_last }) {
            value
            owner {
              id
              name
            }
          }
        }
      }
    }
  }
`;

function UserSubcriptionProvider({ children }) {
  const user = useUser();
  const router = useRouter();
  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_USER, {
    skip: !user,
    variables: {
      userId: user?.id,
    },
  });
  useEffect(() => {
    if (data && !loading) {
      if (data?.user?.room) {
        if (data.user.room.state === "selecting") {
          if (
            !["/movies", "/summary", "/people", "/tv"].some((x) =>
              router.pathname.startsWith(x)
            )
          ) {
          }
        }
      }
    }
  }, [data, loading, user, router]);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return (
      <div>
        Error! Unable to subcribe to user<div>{JSON.stringify(error)}</div>
      </div>
    );
  }
  return (
    <UserSubscriptionContext.Provider value={data?.user || null}>
      {children}
      {data?.user?.room?.state === "starting" && (
        <Drawer open={true} close={null}>
          <StartingPage />
        </Drawer>
      )}
      {data?.user?.room?.state === "guessing" && (
        <Drawer open={true} close={null}>
          <GuessingPage />
        </Drawer>
      )}
      {data?.user?.room?.state === "revealing" && (
        <Drawer open={true} close={null}>
          <RevealingPage />
        </Drawer>
      )}
    </UserSubscriptionContext.Provider>
  );
}

function useUserSubscription() {
  const context = React.useContext(UserSubscriptionContext);
  if (context === undefined) {
    throw new Error(
      `useUserSubscription must be used within a UserSubcriptionProvider`
    );
  }
  return context;
}

export { UserSubcriptionProvider, useUserSubscription };
