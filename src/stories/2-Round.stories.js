import React from "react";
import RoundSummary from "../components/RoundSummary";

export default { title: "Round" };

export const summary = () => {
  return (
    <RoundSummary
      name={"Dummy Movie"}
      response={10}
      answer={10}
      responses={[{ user: "foo", value: 50 }]}
    />
  );
};
