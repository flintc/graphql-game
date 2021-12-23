import { Counter, RevealingLayout } from "./revealing.page";
export default {
  title: "Revealing Page",
};

export const Page = (args) => {
  return (
    <div className="dark-theme">
      <RevealingLayout {...args} />
    </div>
  );
};

Page.args = {
  userResponse: {
    value: 88,
  },
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
