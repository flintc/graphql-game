import { animate } from "framer-motion";
import fetch from "isomorphic-unfetch";
import { useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { useUserSubscription } from "../user-subscription";

export function Counter({ from, to }) {
  const ref = useRef();
  useEffect(() => {
    animate();
    const controls = animate(from, to, {
      type: "spring",
      duration: 10,
      bounce: 0.4,
      onUpdate(value) {
        ref.current.textContent = value.toFixed(0);
      },
    });
    return () => controls.stop();
  }, [from, to]);

  return <p ref={ref} />;
}

export const RevealingLayout = ({
  userResponse,
  loading,
  error,
  onNextRound,
  question,
}) => {
  return (
    <div>
      <h1>Revealing</h1>
      <div>{userResponse.value}</div>
      <Counter from={0} to={question.answer.value} />
      <div>
        <button disabled={loading || error} onClick={onNextRound}>
          Next round
        </button>
      </div>
    </div>
  );
};

export default function RevealingPage() {
  const user = useUserSubscription();
  const question = user?.room?.questions?.[user?.room?.round];
  const userResponse = question.responses.find((x) => x.owner.id === user.id);
  const { mutate, loading, error } = useMutation("nextRound", () => {
    return fetch(`/api/nextRound?roomName=${user.room.name}`);
  });
  return (
    <RevealingLayout
      userResponse={userResponse}
      loading={loading}
      error={error}
      onNextRound={() => {
        mutate();
      }}
    />
  );
}
