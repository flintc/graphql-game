import React, { useRef, useContext, useState } from "react";
import { useSpring, animated, useChain, useTrail, config } from "react-spring";
import * as R from "ramda";
import * as L from "partial.lenses";
import { computeScore } from "../utils";

const Context = React.createContext({ done: true });

const CorrectScore = animated(({ name, value, ...props }) => {
  return (
    <div {...props}>
      {name}: {value}
    </div>
  );
});

const Score = ({ value }) => {
  const prefix = value > 0 ? "+" : "";
  const textColor = value > 0 ? "text-red-500" : "text-green-500";
  return (
    <span className={`${textColor} font-semibold`}>
      {prefix}
      {value}
    </span>
  );
};

const RoundAnswer = ({ name, answer }) => {
  const { correctScoreRef } = useContext(Context);
  const props = useSpring({
    config: {
      mass: 55, //+ (Math.random() - 0.5) * 100,
      friction: 100, //+ (Math.random() - 0.5) * 100,
      tension: 250 //+ (Math.random() - 0.5) * 100
    },
    from: { answer: 0 },
    to: { answer },
    ref: correctScoreRef
  });
  return (
    <CorrectScore
      name={name}
      value={props.answer.interpolate(x => x.toFixed())}
    />
  );
};
const RoundResponses = ({ responses }) => {
  const sortedResults = R.sortBy(R.prop("score"), responses);
  const { trailsRef, setDone } = useContext(Context);
  const trail = useTrail(sortedResults.length, {
    config: config.molasses,
    transform: "translate3d(0px,0,0)",
    opacity: 1,
    from: { transform: "translate3d(150px,0,0)", opacity: 0 },
    ref: trailsRef,
    onRest: () => setDone(true)
  });

  return (
    <ul>
      {trail.map((props, ix) => {
        return (
          <animated.li key={ix} style={props}>
            {sortedResults[ix].user}: {sortedResults[ix].value}
            <Score value={sortedResults[ix].score} />
          </animated.li>
        );
      })}
    </ul>
  );
};

const RoundSummaryBtnGroup = ({ onNextRound, onEndGame }) => {
  const { done } = useContext(Context);
  if (done) {
    return (
      <div className="btn-group">
        <button className="btn" onClick={onNextRound}>
          next round
        </button>
        <button className="btn" onClick={onEndGame}>
          end game
        </button>
      </div>
    );
  }
  return null;
};
const RoundSummary = ({ children }) => {
  const correctScoreRef = useRef();
  const trailsRef = useRef();
  const [done, setDone] = useState(false);
  useChain([correctScoreRef, trailsRef], [0, 1], 7000);
  return (
    <Context.Provider value={{ correctScoreRef, trailsRef, done, setDone }}>
      {children}
    </Context.Provider>
  );
};

RoundSummary.BtnGroup = RoundSummaryBtnGroup;
RoundSummary.Answer = RoundAnswer;
RoundSummary.Ranking = RoundResponses;
export default RoundSummary;
