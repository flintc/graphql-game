import React, { createContext } from "react";
const UserSubscriptionContext = createContext();

function useUserSubscription() {
  const context = React.useContext(UserSubscriptionContext);
  if (context === undefined) {
    throw new Error(
      `useUserSubscription must be used within a UserSubcriptionProvider`
    );
  }
  return context;
}

export { useUserSubscription, UserSubscriptionContext };
