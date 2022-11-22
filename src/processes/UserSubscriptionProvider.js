import { useSubscription } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Drawer } from "../shared/drawer";
import GuessingPage from "../pages/guessing.page";
import RevealingPage from "../pages/revealing.page";
import StartingPage from "../pages/starting.page";
import { useUser, UserSubscriptionContext } from "../shared/user-context";

export default function UserSubcriptionProvider({ children }) {
  const user = useUser();
  const router = useRouter();
  const { data, loading, error } = useSubscription(SUBSCRIBE_TO_USER, {
    skip: !user,
    variables: {
      userId: user?.id,
    },
  });
  console.log("???", user);
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
