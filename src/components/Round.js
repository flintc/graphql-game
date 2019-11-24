import { useMutation } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import MovieSearch from "./MovieSearch";
import RoundQuestionCard from "./RoundQuestionCard";
import RoundSummary from "./RoundSummary";
import { collectResults } from "../utils";

const Round = ({ data, nUsers, roomId, roundOver, setRoundOver }) => {
  const { user } = useContext(StateContext);

  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const onNextRound = () => {
    nextRound({ variables: { roomId: data.room.id } });
  };
  const onEndGame = () => console.log("done.");
  const onQuestionSelect = json => {
    submitQuestion({
      variables: {
        roomId: roomId,
        description: json.description,
        imageUrl: json.poster,
        name: json.title,
        answer: json.reception
      }
    });
  };
  useEffect(() => {
    if (data && nUsers === data.responses.length) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [data, nUsers]);

  const userResponse = L.get(
    ["responses", L.whereEq({ owner: { id: user.id } })],
    data
  );
  const answer = L.get(["answer", "score", "rottenTomatoes"], data);
  const collectRoundResults = collectResults(user, answer);
  if (data) {
    if (data.answer && roundOver) {
      return (
        <RoundSummary>
          <RoundSummary.Answer name={data.name} answer={answer} />
          <RoundSummary.Ranking
            responses={collectRoundResults(data.responses)}
          />
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
  }
  return <MovieSearch roomId={roomId} onSelection={onQuestionSelect} />;
};

export default Round;
