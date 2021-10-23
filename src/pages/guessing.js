import { useUserSubscription } from "../user-subscription";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
import { useCallback } from "react";

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
  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const out = foo(user);
      const resp = await fetch(
        `/api/submitAnswer?questionId=${out.questionId}&ownerId=${user.id}`,
        {
          method: "POST",
          body: JSON.stringify({
            answer: e.target.elements.answer.value,
            roomState: out.roomState,
          }),
        }
      );
      if (resp.ok) {
        const data = await resp.json();
      }
    },
    [user]
  );
  if (!user.room) {
    return (
      <div>
        <h1>You are not in a room</h1>
        <Link href={{ pathname: "/create" }}>Create</Link>
        <button>Join</button>
      </div>
    );
  }
  const question = user.room.questions[user.room.round];
  return (
    <div>
      <h1>Guessing</h1>
      <div>
        <h1>{question?.name}</h1>
        <p>{question?.description}</p>
        <form onSubmit={onSubmit}>
          <input id="answer" placeholder="Your guess" />
          <button>submit answer</button>
        </form>
      </div>
    </div>
  );
}
