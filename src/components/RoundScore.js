import React from "react";
import { computeScore } from "../utils";
import * as R from "ramda";
import * as L from "partial.lenses";

const Score = ({ value }) => {
  const prefix = value > 0 ? "+" : "";
  const textColor = value > 0 ? "text-red-500" : "text-green-500";
  return (
    <span className={`${textColor} font-semibold`}>
      {prefix}
      {value}
    </span>
  );
};

const RoundResult = ({ name, response, answer, responses }) => {
  const results = L.modify(
    [L.elems],
    x =>
      R.mergeRight(x, {
        score: computeScore({ response: x.value, answer })
      }),
    R.append({ user: "you", value: response }, responses)
  );
  return (
    <div>
      {name}: {answer}
      <ul>
        {R.sortBy(R.prop("value"), results).map((r, i) => {
          return (
            <li key={i}>
              {r.user}: {r.value} <Score value={r.score} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RoundResult;
