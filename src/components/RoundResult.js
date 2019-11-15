import React from "react";
import { computeScore } from "../utils";

const RoundResult = ({ guess, answer }) => {
  return (
    <div>
      <div>Your Answer: {guess}</div>
      <div>Correct Answer: {answer}</div>
      <div>Score: {computeScore(guess, answer)}</div>
    </div>
  );
};

export default RoundResult;
