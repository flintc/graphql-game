import React, { useState, useRef } from "react";
import { animated, useSpring, config, useChain } from "react-spring";

const FinalResult = ({ yourScore, criticsScore, transform, opacity = 1 }) => {
  return (
    <div class="rounded-lg my-2 flex justify-center items-center text-gray-600 leading-tight">
      <animated.div
        style={{ opacity }}
        class="text-center mr-16 border-r border-gray-600  pr-16"
      >
        <h2 className="font-semibold text-2xl">{yourScore}</h2>
        <span className="font-hairline">You</span>
      </animated.div>
      <animated.div
        style={{
          transform:
            transform &&
            transform.interpolate((x, y) => `scale(${x}) translateX(${y}%)`)
        }}
        class="text-center font-hairline"
      >
        <animated.h2 className="font-semibold text-2xl">
          {criticsScore.interpolate
            ? criticsScore.interpolate(x => (x >= 0 ? x.toFixed() : "?"))
            : criticsScore}
        </animated.h2>
        <span>Critics</span>
      </animated.div>
    </div>
  );
};

const FinalResultTransition = props => {
  return <FinalResult {...useRevealAnimation(props)} />;
};

const useRevealAnimation = ({ yourScore, criticsScore }) => {
  const [reversed, setReversed] = useState(false);
  const transformRef = useRef();
  const valueRef = useRef();
  const { transform, opacity } = useSpring({
    from: { transform: [1, 0], opacity: 1, value: 0 },
    to: async next => {
      await next({ transform: [1.5, -120], opacity: 0, value: criticsScore });
    },
    config: config.molasses,
    ref: transformRef,
    reverse: reversed
  });
  const { value } = useSpring({
    from: { value: -1 },
    to: async next => {
      await next({ value: criticsScore });
    },
    config: {
      mass: 55,
      friction: 100,
      tension: 250
    },
    ref: valueRef,
    onRest: () => setReversed(true)
  });
  useChain([transformRef, valueRef], [0, 1], 3000);
  return { yourScore, criticsScore: value, transform, opacity };
};

const Header = ({ children }) => {
  return <div className="sticky top-0 bg-white py-2">{children}</div>;
};

const Title = ({ name, year }) => {
  return (
    <h1 className="text-gray-700 text-2xl">
      {name} <span className="text-base text-gray-500">({year})</span>{" "}
      {/* <span className="text-sm">
        <button className="btn-circle float-right h-8 w-8 rounded-full text-white">
          <svg
            className="fill-current -mx-2"
            xmlns="http://www.w3.org/2000/svg"
            width={"15"}
            dx="-10"
            height={"15"}
            viewBox="0 0 20 20"
          >
            <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
          </svg>
        </button>
      </span> */}
    </h1>
  );
};

const Content = ({ children }) => {
  return <p className="text-gray-800 px-4 text-lg">{children}</p>;
};

const Input = ({ onSubmit }) => {
  const [value, setValue] = useState();
  return (
    <span className="flex flex-row w-auto px-4 pt-4 mb-2">
      <input
        placeholder="Enter your guess..."
        value={value}
        className="attached-right shadow-none"
        onChange={e => setValue(e.target.value)}
      />
      <button className="btn attached-left" onClick={() => onSubmit(value)}>
        submit
      </button>
    </span>
  );
};

const RoundCard = ({ imgSrc, children }) => {
  return (
    <div
      class="bg-cover bg-top bg-fixed"
      style={{
        backgroundImage: `url(${imgSrc})`
      }}
    >
      <div class="text-white h-screen"></div>
      <div
        class="-my-32 p-4 bg-white rounded-lg shadow-inner min-h-screen"
        style={{
          boxShadow:
            " 0 -20px 25px -5px rgba(0, 0, 0, .1), 0 -10px 10px -5px rgba(0, 0, 0, .04)"
        }}
      >
        {children}
      </div>
    </div>
  );
};
RoundCard.Header = Header;
RoundCard.Content = Content;
RoundCard.Title = Title;
RoundCard.Input = Input;
RoundCard.Result = FinalResult;
RoundCard.AnimatedResult = FinalResultTransition;
export default RoundCard;
