/* eslint-disable import/no-anonymous-default-export */
import { Counter, RevealingLayout, UserScoreCard } from "./revealing.page";
export default {
  title: "Revealing Page",
};

export const UserScoreCardComponent = (args) => {
  return (
    <div className="max-w-2xl m-auto">
      <UserScoreCard {...args} />
    </div>
  );
};

UserScoreCardComponent.args = {
  name: "John",
  place: "1st",
  score: "5",
};

export const Page = (args) => {
  return (
    <div className="">
      <RevealingLayout {...args} />
    </div>
  );
};

Page.args = {
  userResponse: {
    value: 68,
    owner: {
      name: "John",
    },
  },
  otherUserResponses: [
    {
      value: 82,
      owner: {
        id: "a",
        name: "Alice",
      },
    },
    {
      value: 77,
      owner: {
        id: "b",
        name: "Barry",
      },
    },
  ],
  question: {
    answer: {
      value: 90,
    },
  },
  loading: false,
  error: false,
};

export const CounterExample = () => {
  return <Counter from={0} to={70} />;
};

export const Foo = () => {
  return (
    <div className="dark-theme">
      <div>
        <button className="bg-grass-11">click me</button>
      </div>
    </div>
  );
};
