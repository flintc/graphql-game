import React, { useRef } from "react";
import { computeScore } from "../utils";
import * as R from "ramda";
import * as L from "partial.lenses";
import {
  useSpring,
  useTransition,
  animated,
  useChain,
  useTrail,
  config
} from "react-spring";

const CorrectScore = animated(({ name, value, ...props }) => {
  console.log("p", props);
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

const RoundResult = ({ name, response, answer, responses }) => {
  const correctScoreRef = useRef();
  const props = useSpring({
    config: {
      mass: 50,
      friction: 100,
      tension: 250
    },
    from: { answer: 0 },
    to: { answer },
    ref: correctScoreRef
  });
  const results = R.sortBy(
    R.prop("score"),
    L.modify(
      [L.elems],
      x =>
        R.mergeRight(x, {
          score: computeScore({ response: x.value, answer })
        }),
      R.append({ user: "you", value: response }, responses)
    )
  );
  const trailsRef = useRef();
  const trail = useTrail(results.length, {
    config: config.molasses,
    transform: "translate3d(0px,0,0)",
    opacity: 1,
    from: { transform: "translate3d(150px,0,0)", opacity: 0 },
    ref: trailsRef
  });
  useChain([correctScoreRef, trailsRef]);
  return (
    <div>
      <CorrectScore
        name={name}
        value={props.answer.interpolate(x => x.toFixed())}
      />
      <ul>
        {trail.map((props, ix) => {
          return (
            <animated.li key={ix} style={props}>
              {results[ix].user}: {results[ix].value}{" "}
              <Score value={results[ix].score} />
            </animated.li>
          );
        })}
        {/* {transitions.map(({ item, key, props }) => {
          return (
            <animated.li key={key} style={props}>
              {item.user}: {item.value} <Score value={item.score} />
            </animated.li>
          );
        })} */}
      </ul>
    </div>
  );
};

export default RoundResult;
