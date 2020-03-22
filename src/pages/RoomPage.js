import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Link } from "@reach/router";
import * as L from "partial.lenses";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import MovieSearch from "../components/MovieSearch";
import * as docs from "../documents";
import { useMachine } from "@xstate/react";
import { useApolloClient } from "react-apollo";
import { gameMachine } from "../gameMachine";
import RoundQuestionCard from "../components/RoundQuestionCard";
import RoundSummary from "../components/RoundSummary";
import { collectResults } from "../utils";
import UserList from "../components/UserList";

const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(StateContext);
  const client = useApolloClient();
  const [current, send] = useMachine(
    gameMachine.withContext({
      ...gameMachine.context,
      client,
      roomName: name,
      userId: user.id
    }),
    { devTools: true }
  );
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const onQuestionSelect = json => {
    submitQuestion({
      variables: {
        roomId: current.context.id,
        description: json.description,
        imageUrl: json.poster,
        name: json.title,
        answer: json.reception
      }
    });
  };
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const onNextRound = () => {
    send("NEXT_ROUND");
    nextRound({ variables: { roomId: current.context.question.room.id } });
  };
  // TODO: handle game end, game summary and then have user leave room
  const onEndGame = () => console.log("done.");
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      <h1>{JSON.stringify(current.value)}</h1>
      <h1>{current.context.id}</h1>
      <span className="fixed top-0 my-2 inline-flex">
        <h1>
          {current.context.name} -{" "}
          <Link
            className="text-blue-700 hover:text-blue-400"
            to={`/#/login/${user.id}`}
          >
            your login link
          </Link>
        </h1>
      </span>
      {current.matches("selecting") && (
        <>
          <MovieSearch
            roomId={current.context.id}
            onSelection={onQuestionSelect}
          />
          {`score: ${current.context.score}`}
        </>
      )}
      {current.matches("answering") && (
        <RoundQuestionCard
          name={current.context.question.name}
          description={current.context.question.description}
          id={current.context.question.id}
          userId={user.id}
          imgSrc={current.context.question.imageUrl}
          onSubmit={submitResponse}
        />
      )}
      {current.matches("roundSummary") && (
        <RoundSummary>
          <RoundSummary.Answer
            name={current.context.question.name}
            answer={current.context.question.answer.score.rottenTomatoes}
          />
          <RoundSummary.Ranking
            responses={collectResults(
              user,
              current.context.question.answer.score.rottenTomatoes,
              current.context.responses
            )}
          />
          <RoundSummary.BtnGroup
            onNextRound={onNextRound}
            onEndGame={onEndGame}
          />
        </RoundSummary>
      )}
      <UserList data={current.context.users} />
    </div>
  );
};

export default RoomPage;
