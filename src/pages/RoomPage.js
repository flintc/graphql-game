import { useMutation } from "@apollo/react-hooks";
import { Link } from "@reach/router";
import { useMachine } from "@xstate/react";
import * as R from "ramda";
import React, { useContext } from "react";
import { useApolloClient } from "react-apollo";
import { StateContext } from "../app-state";
import MovieSearch from "../components/MovieSearch";
import RoundCard from "../components/RoundCard";
import RoundSummary from "../components/RoundSummary";
import UserList from "../components/UserList";
import * as docs from "../documents";
import { config, gameMachine } from "../gameMachine";
import { collectResults } from "../utils";
const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(StateContext);
  const client = useApolloClient();
  const [current, send] = useMachine(
    gameMachine
      .withContext({
        ...gameMachine.context,
        client,
        roomName: name,
        userId: user.id
      })
      .withConfig(R.mergeDeepRight(config, {})),
    { devTools: true }
  );
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [submitResponseMutation] = useMutation(
    docs.SUBMIT_RESPONSE_FOR_QUESTION
  );
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
  const submitResponse = value => {
    submitResponseMutation({
      variables: {
        userId: user.id,
        questionId: current.context.question.id,
        value
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
  return current.matches("selected") ? (
    <RoundCard imgSrc={current.context.question.imageUrl}>
      <RoundCard.Header>
        <RoundCard.Title name={current.context.question.name} year={1990} />
        {current.matches("selected.answering") && (
          <RoundCard.Input onSubmit={submitResponse} />
        )}
        {current.matches("selected.answered") && (
          <RoundCard.Result
            yourScore={current.context.answer}
            criticsScore="?"
          />
        )}
        {current.matches("selected.revealing") && (
          <RoundCard.AnimatedResult
            yourScore={current.context.answer}
            criticsScore={current.context.question.answer.score.rottenTomatoes}
          />
        )}
        {current.matches("selected.roundSummary") && (
          <>
            <RoundCard.Result
              yourScore={current.context.answer}
              criticsScore={
                current.context.question.answer.score.rottenTomatoes
              }
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
        )}
      </RoundCard.Header>
      <RoundCard.Content>
        {current.matches("selected.roundSummary") ? (
          current.context.question.answer.text
        ) : current.matches("selected.revealing") ? (
          <>
            <div className="text-white">
              {current.context.question.answer.text}
            </div>
            <RoundSummary.Ranking
              responses={collectResults(
                user,
                current.context.question.answer.score.rottenTomatoes,
                current.context.responses
              )}
            />
          </>
        ) : (
          current.context.question.description
        )}
      </RoundCard.Content>
    </RoundCard>
  ) : (
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

      <UserList data={current.context.users} />
    </div>
  );
};

export default RoomPage;
