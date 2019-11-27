import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Link } from "@reach/router";
import * as L from "partial.lenses";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../app-state";
import MovieSearch from "../components/MovieSearch";
import Room from "../components/Room";
import * as docs from "../documents";

const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(StateContext);
  const [roundOver, setRoundOver] = useState(false);
  const resp = useSubscription(docs.SUBSCRIBE_TO_ROOM_BY_NAME, {
    variables: { name }
  });
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const onQuestionSelect = json => {
    submitQuestion({
      variables: {
        roomId: room.id,
        description: json.description,
        imageUrl: json.poster,
        name: json.title,
        answer: json.reception
      }
    });
  };
  const room = L.get(["data", "room", 0], resp);
  const round = L.get(["questions", R.propOr(0, "round", room)], room);

  useEffect(() => {
    if (
      round &&
      L.get(["users", "length"], room) === L.get(["responses", "length"], round)
    ) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [round, room, setRoundOver]);
  if (resp.loading) {
    return "Loading...";
  }
  const questions = L.collect([
    L.elems,
    L.pick({
      answer: ["answer", "score", "rottenTomatoes"],
      response: {
        value: ["responses", L.whereEq({ owner: { id: user.id } }), "value"]
      }
    })
  ])(room.questions);
  const userResponse = L.get(
    ["responses", L.whereEq({ owner: { id: user.id } })],
    round
  );

  // TODO: lift logic that transforms users to include bool for hasAnswer in the component instead of
  // Room.UserList, that way we don't have to pass down responses

  return (
    <Room>
      <span className="fixed top-0 my-2 inline-flex">
        <h1>
          {room.name} -{" "}
          <Link
            className="text-blue-700 hover:text-blue-400"
            to={`/#/login/${user.id}`}
          >
            your login link
          </Link>
        </h1>
      </span>
      {round ? (
        <Room.Round
          data={round}
          roomId={room.id}
          userResponse={userResponse}
          nUsers={room.users.length}
          roundOver={roundOver}
          setRoundOver={setRoundOver}
        />
      ) : (
        <>
          <MovieSearch roomId={room.id} onSelection={onQuestionSelect} />{" "}
          {!(L.get("answer", round) && userResponse && roundOver) && (
            <Room.Score data={questions} />
          )}
        </>
      )}
      <Room.UserList
        data={room.users}
        responses={R.propOr([], "responses", room.questions[room.round])}
      />
    </Room>
  );
};

export default RoomPage;
