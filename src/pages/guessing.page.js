import { useUserSubscription } from "../shared/user-subscription";
import fetch from "isomorphic-unfetch";

import Link from "next/link";
import { useCallback } from "react";
import { RottenOrFreshLayout } from "./game/rottenOrFresh/movie/[id].page";
import { useMovie } from "../entities/movie/useMovie";
import { useMutation } from "react-query";
const foo = (user) => {
  const room = user?.room;
  const question = room.questions[room.round];
  const users = room.users;
  const responseOwnerIds = new Set(question.responses.map((x) => x.owner.id));
  const userIds = new Set(users.map((x) => x.id));
  const difference = new Set(
    [...userIds].filter((x) => !responseOwnerIds.has(x))
  );
  let roomState = "guessing";
  if (difference.size === 1 && difference.has(user.id)) {
    roomState = "revealing";
  }
  return {
    questionId: question.id,
    ownerId: user.id,
    roomState,
  };
};

export default function Guessing() {
  const user = useUserSubscription();
  const { mutate, status: submitAnswerStatus } = useMutation(
    "submitAnswer",
    async (answer) => {
      const out = foo(user);
      const resp = await fetch(
        `/api/submitAnswer?questionId=${out.questionId}&ownerId=${user.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            answer: answer.value,
            roomState: out.roomState,
          }),
        }
      );
      if (resp.ok) {
        const data = await resp.json();
      }
    }
  );
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      mutate({ value: e.target.elements.answer.value });
    },
    [mutate]
  );
  const question = user.room.questions[user.room.round];
  const userResponse = question?.responses?.find((x) => x.owner.id === user.id);
  const { status, data } = useMovie(question.questionId);
  if (!user.room) {
    return (
      <div>
        <h1>You are not in a room</h1>
        <Link href={{ pathname: "/create" }}>Create</Link>
        <button>Join</button>
      </div>
    );
  }
  if (status === "loading") {
    return <div>loading</div>;
  }
  if (status === "error") {
    return <div>error</div>;
  }
  const numRemaining = user.room.users.length - question.responses.length;
  return (
    <RottenOrFreshLayout
      data={data}
      onSubmit={onSubmit}
      submitAnswerStatus={submitAnswerStatus}
      allowScoreSource={false}
      guess={userResponse?.value}
    >
      <div className="px-2 mt-4">
        <div className="text-center">{`You're locked in! Waiting on responses from ${numRemaining} ${
          numRemaining === 1 ? "player" : "players"
        }`}</div>
      </div>
    </RottenOrFreshLayout>
  );
}
