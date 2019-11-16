import React from "react";
import { computeScore } from "../utils";

const RoundResult = ({ response, answer, responses }) => {
  console.log("RESPONSES!", responses);
  return (
    <div>
      <div>Your Answer: {response}</div>
      <ul>
        {responses.map((r, i) => {
          return (
            <li key={i}>
              {r.user}'s answer: {r.value}
            </li>
          );
        })}
      </ul>
      <div>Correct Answer: {answer}</div>
      <div>Score: {computeScore({ response, answer })}</div>
    </div>
  );
};

export default RoundResult;
