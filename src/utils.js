import * as R from "ramda";
import * as L from "partial.lenses";

export const generateCode = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 4)
    .toUpperCase();

export const computeScore = ({ response, answer }) => {
  if (response === answer) {
    return -5;
  }
  return Math.abs(answer - response);
};

export const collectResults = R.curry((user, answer, responses) =>
  L.collect(
    [
      L.elems,
      L.pick({
        user: ["owner", x => (x.id === user.id ? "you" : user.name)],
        value: "value",
        score: [
          "value",
          x => {
            console.log("x", x);
            return computeScore({ response: x, answer });
          }
        ]
      })
    ],
    responses
  )
);
