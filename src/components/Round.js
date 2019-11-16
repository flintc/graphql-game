import { useMutation } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import * as docs from "../documents";
import MovieSearch from "./MovieSearch";
import RoundQuestionCard from "./RoundQuestionCard";
import RoundSummary from "./RoundSummary";

const Round = ({ data, nUsers, roomId }) => {
  const { user } = useContext(StateContext);
  const [roundOver, setRoundOver] = useState(false);
  const onEndGame = () => console.log("done.");
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
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
  const responses = L.collect(
    [
      "responses",
      L.filter(x => x.owner.id !== user.id),
      L.elems,
      L.pick({ user: ["owner", "name"], value: "value" })
    ],
    data
  );

  const onNextRound = () => {
    nextRound({ variables: { roomId: data.room.id } });
  };

  if (data) {
    if (data.answer && roundOver) {
      return (
        <RoundSummary
          name={data.name}
          response={userResponse.value}
          answer={data.answer.score.rottenTomatoes}
          responses={responses}
          onNextRound={onNextRound}
          onEndGame={onEndGame}
        />
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
  return <MovieSearch roomId={roomId} />;
};

export default Round;
