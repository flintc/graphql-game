import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import UserList from "./UserList";
import { StateContext } from "../app-state";
import * as L from "partial.lenses";
import { computeScore } from "../utils";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import RoundQuestionCard from "./RoundQuestionCard";
import MovieSearchInput from "./MovieSearchInput";
import * as docs from "../documents";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const Question = ({ data, nUsers, roomId }) => {
  const history = useHistory();
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [roundOver, setRoundOver] = useState(false);
  const onEndGame = () => {
    history.push(`/game/${data.room.name}/score`);
  };
  useEffect(() => {
    if (data && nUsers === data.responses.length) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [data, nUsers]);
  if (data) {
    return (
      <RoundQuestionCard
        data={data}
        roundOver={roundOver}
        onEndGame={onEndGame}
      />
    );
  }
  const handleSelected = title => {
    fetch(searchUrl(title))
      .then(async resp => {
        const json = await resp.json();
        submitQuestion({
          variables: {
            roomId: roomId,
            description: json.description,
            imageUrl: json.poster,
            name: json.title,
            answer: json.reception
          }
        });
      })
      .catch(err => {
        console.error("error!", err);
      });
  };
  return <MovieSearchInput onSelect={handleSelected} />;
};

const Score = ({ data }) => {
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

const Room = ({ data }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      <Question
        data={data.questions[data.round]}
        roomId={data.id}
        nUsers={data.users.length}
      />
      <Score data={data.questions} />
      <UserList
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
};

export default Room;
