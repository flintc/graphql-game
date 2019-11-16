import React from "react";
import RoundScore from "./RoundScore";

const RoundSummary = ({
  name,
  response,
  responses,
  answer,
  onNextRound,
  onEndGame
}) => {
  return (
    <>
      <RoundScore
        name={name}
        response={response}
        answer={answer}
        responses={responses}
      />
      <div className="btn-group">
        <button className="btn" onClick={onNextRound}>
          next round
        </button>
        <button className="btn" onClick={onEndGame}>
          end game
        </button>
      </div>
    </>
  );
};

export default RoundSummary;
