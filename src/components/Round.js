import { useMutation } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import { collectResults } from "../utils";
import RoundQuestionCard from "./RoundQuestionCard";
import RoundSummary from "./RoundSummary";

const Round = ({ data, userResponse, roundOver }) => {
  const { user } = useContext(StateContext);

  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const onNextRound = () => {
    nextRound({ variables: { roomId: data.room.id } });
  };
  // TODO: handle game end, game summary and then have user leave room
  const onEndGame = () => console.log("done.");
  const answer = L.get(["answer", "score", "rottenTomatoes"], data);
  const collectRoundResults = collectResults(user, answer);
  if (data.answer && roundOver) {
    return (
      <RoundSummary>
        <RoundSummary.Answer name={data.name} answer={answer} />
        <RoundSummary.Ranking responses={collectRoundResults(data.responses)} />
        <RoundSummary.BtnGroup
          onNextRound={onNextRound}
          onEndGame={onEndGame}
        />
      </RoundSummary>
    );
  } else if (!userResponse) {
    return (
      <RoundQuestionCard
        name={data.name}
        description={data.description}
        id={data.id}
        userId={user.id}
        imgSrc={data.imageUrl}
        onSubmit={submitResponse}
      />
    );
  } else {
    return <span>Current Answer: {userResponse.value}</span>;
  }
};

export default Round;
