import * as L from "partial.lenses";
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
