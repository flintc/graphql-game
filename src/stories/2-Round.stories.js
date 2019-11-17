import React from "react";
import RoundSummary from "../components/RoundSummary";

export default { title: "Round" };

export const summary = () => {
  return (
    <RoundSummary
      name={"Dummy Movie"}
      response={10}
      answer={68}
      responses={[
        { user: "foo", value: 50 },
        { user: "bar", value: 70 }
      ]}
    />
  );
};
