import { animate } from "framer-motion";
import fetch from "isomorphic-unfetch";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { useUserSubscription } from "../user-subscription";
import { motion } from "framer-motion";
export function Counter({ from, to }) {
  const ref = useRef();
  useEffect(() => {
    animate();
    const controls = animate(from, to, {
      type: "spring",
      duration: 8,
      bounce: 0.4,
      delay: 0.5,
      onUpdate(value) {
        ref.current.textContent = value.toFixed(0);
      },
    });
    return () => controls.stop();
  }, [from, to]);

  return <p ref={ref}> {from} </p>;
}

const place = {
  0: "1st",
  1: "2nd",
  2: "3rd",
  3: "4th",
  4: "5th",
  5: "6th",
  6: "7th",
  7: "8th",
  8: "9th",
  9: "10th",
  10: "11th",
  11: "12th",
};

export const UserScoreCard = ({ name, place, score }) => {
  return (
    <div className="flex items-center gap-6 px-6 py-4 rounded-md bg-gray-4">
      <div className="grid flex-none w-12 h-12 rounded-full place-content-center bg-primary-8">
        {place}
      </div>
      <div className="flex-grow font-semibold">{name}</div>
      <div className="flex-none">{score}</div>
    </div>
  );
};

export function ScoreBar({ className, to, children, motionProps }) {
  return (
    <div className={`relative overflow-hidden  bg-gray-3 ${className}`}>
      <motion.div
        initial={{ width: "0%" }}
        animate={{ width: `${to}%` }}
        transition={{ duration: 8, type: "spring", bounce: 0.4, delay: 0.5 }}
        className="h-full bg-primary-4"
        {...motionProps}
      >
        {children}
      </motion.div>
    </div>
  );
}

const container = {
  hidden: {},
  show: {
    transition: {
      duration: 0.5,
      staggerChildren: 0.5,
      delayChildren: 0.5,
    },
  },
};

export const RevealingLayout = ({
  userResponse,
  otherUserResponses,
  loading,
  error,
  onNextRound,
  question,
}) => {
  const [state, setState] = useState("revealing");
  return (
    <div className="max-w-2xl px-3 m-auto mt-4 space-y-4">
      <div className="space-y-2">
        <div className="text-5xl font-medium text-center">
          <Counter from={0} to={question.answer.value} />
        </div>
        <ScoreBar
          from={0}
          to={question.answer.value}
          style={{}}
          className="h-6 rounded-full"
          motionProps={{ onAnimationComplete: () => setState("revealed") }}
        >
          {otherUserResponses.map((x) => {
            return (
              <div
                key={x.owner.id}
                style={{ left: `${x.value}%` }}
                className="absolute w-1 h-full bg-primary-10"
              ></div>
            );
          })}
          <div
            key={userResponse.owner.id}
            style={{ left: `${userResponse.value}%` }}
            className="absolute w-1 h-full bg-secondary-10"
          ></div>
        </ScoreBar>
      </div>
      {state.startsWith("revealed") && (
        <motion.div
          className="flex flex-col gap-3 mt-4"
          variants={container}
          // transition={{ duration: 1.5 }}
          initial="hidden"
          animate="show"
          onAnimationComplete={() => setState("revealed.nextRound")}
        >
          {[userResponse, ...otherUserResponses]
            .sort((a, b) => {
              return (
                Math.abs(question.answer.value - a.value) -
                Math.abs(question.answer.value - b.value)
              );
            })
            .map((x, ix) => {
              console.log("...", x.value);
              return (
                <motion.div
                  key={x.owner.id}
                  variants={{
                    hidden: {
                      scale: 0,
                    },
                    show: {
                      scale: 1,
                    },
                  }}
                  className=""
                >
                  <UserScoreCard
                    place={place[ix]}
                    name={x.owner.name}
                    score={Math.abs(question.answer.value - x.value)}
                  />
                </motion.div>
              );
            })}
        </motion.div>
      )}
      {state.endsWith("nextRound") && (
        <motion.div
          className=""
          variants={{ hidden: { scale: 0 }, show: { scale: 1 } }}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
        >
          <button
            className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12"
            disabled={loading || error}
            onClick={onNextRound}
          >
            Next round
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default function RevealingPage() {
  const user = useUserSubscription();
  const question = user?.room?.questions?.[user?.room?.round];
  const userResponse = question?.responses?.find((x) => x.owner.id === user.id);
  const otherUserResponses = question?.responses?.filter(
    (x) => x.owner.id !== user.id
  );
  const { mutate, loading, error } = useMutation("nextRound", () => {
    return fetch(`/api/nextRound?roomName=${user.room.name}`);
  });

  if (!question) {
    // TODO: should be handled elsewhere but needed when other user clicks next round
    return null;
  }
  return (
    <RevealingLayout
      userResponse={userResponse}
      otherUserResponses={otherUserResponses}
      loading={loading}
      error={error}
      question={question}
      onNextRound={() => {
        mutate();
      }}
    />
  );
}
