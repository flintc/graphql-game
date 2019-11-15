import { useMutation } from "@apollo/react-hooks";
import * as L from "partial.lenses";
import React, { useContext, useState } from "react";
import * as docs from "../documents";
import RoundResult from "./RoundResult";
import { StateContext } from "../app-state";

const RoundQuestionCard = ({ data, roundOver, onEndGame }) => {
  const { user } = useContext(StateContext);
  const [value, setValue] = useState(null);
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const userResponse = L.get(
    [L.whereEq({ owner: { id: user.id } })],
    data.responses
  );
  if (!userResponse) {
    console.log("q data", data);
    return (
      <div className="shadow rounded-lg border shadow-2xl bg-white w-8/12 sm:w-2/3 lg:w-1/2 xl:w-1/3 pb-4">
        <div className="showit relative" style={{ height: "calc(55vh)" }}>
          <img
            className="blurme absolute top-0 object-cover rounded-t-lg w-full"
            src={data.imageUrl}
            style={{ height: "calc(55vh)" }}
          />
          <p
            className="p-4 absolute top-0 text-gray-800 text-lg showme rounded-t-lg w-full"
            style={{ height: "100%", overflowY: "scroll" }}
          >
            {data.description}
          </p>
        </div>
        <div className="rounded-b-lg p-2">
          <h1 className="text-gray-700">{data.name}</h1>
          <form
            className="flex flex-row w-full "
            onSubmit={e => {
              e.preventDefault();
              submitResponse({
                variables: {
                  userId: user.id,
                  questionId: data.id,
                  value
                }
              });
            }}
          >
            <input
              placeholder="Enter your guess..."
              value={value}
              className="attached-right shadow-none"
              onChange={e => setValue(e.target.value)}
            />
            <button className="btn attached-left">submit</button>
          </form>
        </div>
      </div>
    );
  }
  if (data.answer && roundOver) {
    return (
      <>
        <RoundResult
          guess={userResponse.value}
          answer={data.answer.score.rottenTomatoes}
        />
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => {
              nextRound({ variables: { roomId: data.room.id } });
            }}
          >
            next round
          </button>
          <button className="btn" onClick={onEndGame}>
            end game
          </button>
        </div>
      </>
    );
  }
  return <span>Current Answer: {userResponse.value}</span>;
};

export default RoundQuestionCard;
