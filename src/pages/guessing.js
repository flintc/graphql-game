import { useUserSubscription } from "../user-subscription";
import fetch from "isomorphic-unfetch";
import Link from "next/link";
export default function Guessing() {
  const user = useUserSubscription();
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const resp = await fetch(
              `/api/submitAnswer?questionId=${question.id}&ownerId=${user.id}`,
              {
                method: "POST",
                body: JSON.stringify({
                  answer: e.target.elements.answer.value,
                }),
              }
            );
            if (resp.ok) {
              const data = await resp.json();
            }
          }}
        >
          <input id="answer" placeholder="Your guess" />
          <button>submit answer</button>
        </form>
      </div>
    </div>
  );
}
