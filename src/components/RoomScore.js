import * as L from "partial.lenses";
import * as R from "ramda";
import { useContext } from "react";
import { StateContext } from "../app-state";
import { computeScore } from "../utils";

const RoomScore = ({ data }) => {
  return `score: ${L.sum(
    [
      L.elems,
      L.pick({ answer: "answer", response: ["response", "value"] }),
      computeScore
    ],
    data
  )}`;
};

export default RoomScore;
