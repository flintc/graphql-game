import * as L from "partial.lenses";
import * as R from "ramda";
import { useContext } from "react";
import { StateContext } from "../app-state";
import { computeScore } from "../utils";

const RoomScore = ({ data }) => {
  const { user } = useContext(StateContext);
  const scores = data.map(question => {
    const guess = L.get(
      ["responses", L.whereEq({ owner: { id: user.id } }), "value"],
      question
    );
    const answer = L.get(["answer", "score", "rottenTomatoes"], question);
    if (R.all(R.complement(R.isNil), [answer, guess])) {
      console.log("score....", guess, answer);
      return computeScore(guess, answer);
    }
  });
  return `score: ${R.sum(R.filter(R.identity, scores))}`;
};

export default RoomScore;
