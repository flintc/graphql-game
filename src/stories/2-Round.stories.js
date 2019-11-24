import React from "react";
import RoundSummary from "../components/RoundSummary";
import Round from "../components/Round";
import { StateProvider } from "../app-state";
import { collectResults } from "../utils";

export default { title: "Round" };

const user = {
  name: "Carol",
  id: "carol-id"
};

const responses = [
  { owner: { name: "Carol", id: "carol-id" }, value: 66 },
  { owner: { name: "Bob", id: "bob-id" }, value: 50 },
  { owner: { name: "Jack", id: "jack-id" }, value: 70 }
];

export const summary = () => {
  return (
    <RoundSummary
      name={"Dummy Movie 23"}
      response={10}
      answer={68}
      responses={[
        { user: "foo", value: 50 },
        { user: "bar", value: 70 }
      ]}
    />
  );
};
export const round = () => {
  return (
    <RoundSummary>
      <RoundSummary.Answer name={"Dummy Movie"} answer={54} />
      <RoundSummary.Ranking responses={collectResults(user, 54, responses)} />
      <RoundSummary.BtnGroup
        onNextRound={console.log}
        onEndGame={console.log}
      />
    </RoundSummary>
  );
};
const imgSrc =
  "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg";
export const exp = () => {
  const description =
    'The Matrix is a 1999 science fiction action film[3][4] written and directed by the Wachowskis.[a] It stars Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano and is the first installment in the Matrix franchise. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, created by intelligent machines to distract humans while using their bodies as an energy source.[5] When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he "is drawn into a rebellion against the machines"[5] along with other people who have been freed from the Matrix.';

  const name = "The Matrix";
  return (
    <div className="container mx-auto max-w-xs w-full">
      <div className="shadow rounded-lg border shadow-2xl bg-white mx-20">
        <img className="top-0 object-cover rounded-lg w-full" src={imgSrc} />
      </div>
      <div className="relative shadow rounded-lg border shadow-2xl bg-gray-200 -mt-10 mx-4 ">
        <div className="rounded-lg p-4">
          <h1 className="text-gray-700">{name}</h1>
          <p className="text-xs">{description}</p>
        </div>
      </div>
    </div>
  );
};
const name = "The Matrix";
const category = "Films about rebellions";
const year = 1999;
const description =
  'The Matrix is a 1999 science fiction action film[3][4] written and directed by the Wachowskis.[a] It stars Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano and is the first installment in the Matrix franchise. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, created by intelligent machines to distract humans while using their bodies as an energy source.[5] When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he "is drawn into a rebellion against the machines"[5] along with other people who have been freed from the Matrix.';

const users = [
  "aaaaaa",
  "bbbbbb",
  "ccccc",
  "aaaaaa",
  "bbbbbb",
  "ccccc",
  "aaaaaa",
  "bbbbbb",
  "ccccc"
];

const FinalResult = ({ yourScore, criticsScore }) => (
  <div class="rounded-lg my-2 flex justify-center items-center text-gray-600 leading-tight">
    <div class="text-center mr-16 border-r border-gray-600  pr-16">
      <h2 className="font-semibold text-xl">{yourScore}</h2>
      <span className="font-hairline">You</span>
    </div>
    <div class="text-center font-hairline">
      <h2 className="font-semibold text-xl">{criticsScore}</h2>
      <span>Critics</span>
    </div>
  </div>
);

const AnswerInput = ({ onSubmit }) => {
  const [value, setValue] = React.useState();
  return (
    <div className="absolute bottom-0 inline-flex w-full rounded-b-lg">
      <input
        placeholder="Enter your guess..."
        value={value}
        className="attached-right shadow-none rounded-t-none"
        onChange={e => setValue(e.target.value)}
      />
      <button
        onClick={() => onSubmit(value)}
        className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-b-lg attached-left"
      >
        submit
      </button>
    </div>
  );
};

const MovieCard = ({ yourScore, criticsScore, onAnswerSubmit }) => (
  <div className="container mx-auto w-full max-w-sm">
    <div class="relative pb-5/6 mx-10 lg:mx-16">
      <img
        className="relative h-full w-full object-cover rounded-lg shadow-md"
        src={imgSrc}
      />
      <div class="w-64 absolute shadow-2xl z-50 bottom-0 m-12 mb-4 flex items-baseline">
        <input />
        <div className="absolute bottom-0 inline-flex w-full rounded-lg">
          <input
            placeholder="Enter your guess..."
            className="attached-right shadow-none"
          />
          <button className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg attached-left">
            submit
          </button>
        </div>{" "}
      </div>{" "}
      <div class="absolute bottom-0 m-2 mb-12 flex items-baseline">
        <span class="inline-block bg-indigo-200 text-indigo-700 text-xs px-3 rounded-full uppercase font-semibold tracking-wide">
          {category}
        </span>
      </div>
    </div>
    <div class="relative -mt-10 w-full ">
      <div class="bg-white p-6 rounded-lg shadow-2xl ">
        <h4 class="mt-1 font-semibold text-lg leading-tight truncate">
          {name} <span className="text-gray-500 text-sm">({year})</span>
        </h4>
        <div class="my-2 flex items-center">
          <span class="ml-2 text-gray-600 text-xs">{description}</span>
        </div>
        {yourScore && (
          <FinalResult
            yourScore={yourScore}
            criticsScore={criticsScore ? criticsScore : "?"}
          />
        )}
      </div>
      {!yourScore && <AnswerInput onSubmit={onAnswerSubmit} />}
    </div>
  </div>
);

export const exampleCard = () => {
  const [state, setState] = React.useState();
  return (
    <MovieCard
      criticsScore={undefined}
      yourScore={state}
      onAnswerSubmit={setState}
    />
  );
};

const usersAtBottom = () => (
  <div className="flex py-2 flex-row flex-no-wrap justify-between overflow-x-scroll absolute rounded-b-lg w-full bottom-0 bg-indigo-100">
    {users.slice(0, 10).map(user => {
      return (
        <span className="text-gray-600  mr-4 px-2 rounded-full bg-gray-400">
          {user}
        </span>
      );
    })}
  </div>
);

export const designB = () => {
  return (
    <div class="flex flex-col justify-end h-full">
      <div
        class="flex flex-col justify-end bg-cover bg-center h-full rounded-b-lg"
        style={{
          backgroundImage: `url(${imgSrc})`,
          filter: "contrast(80%) brightness(50%)"
        }}
      ></div>
      <div className="text-center text-white absolute top-0 my-8 w-full">
        <h1
          className=" w-full text-2xl"
          style={{ textShadow: "5px 5px 8px rgba(0,0,0,0.95)" }}
        >
          Round 1
        </h1>
        <div className="text-gray-400 text-xl">{description}</div>
      </div>

      {/* <div className="h-64 bg-white">
        <div className="mx-auto -mt-4 p-2 w-1/2 bg-red-500 rounded-lg shadow-xl">
          aaa
        </div>
        aaa
      </div> */}
    </div>
  );
};
