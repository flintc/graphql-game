import React, { useState } from "react";

const RoundQuestionCard = ({
  name,
  description,
  id,
  userId,
  imgSrc,
  onSubmit
}) => {
  const [value, setValue] = useState(null);
  return (
    <div className="shadow rounded-lg border shadow-2xl bg-white w-8/12 sm:w-2/3 lg:w-1/2 xl:w-1/3 pb-4">
      <div className="showit relative" style={{ height: "calc(55vh)" }}>
        <img
          className="blurme absolute top-0 object-cover rounded-t-lg w-full"
          src={imgSrc}
          style={{ height: "calc(55vh)" }}
        />
        <p
          className="p-4 absolute top-0 text-gray-800 text-lg showme rounded-t-lg w-full"
          style={{ height: "100%", overflowY: "scroll" }}
        >
          {description}
        </p>
      </div>
      <div className="rounded-b-lg p-2">
        <h1 className="text-gray-700">{name}</h1>
        <form
          className="flex flex-row w-full "
          onSubmit={e => {
            e.preventDefault();
            onSubmit({
              variables: {
                userId: userId,
                questionId: id,
                value
              }
            });
          }}
        >
          <input
            placeholder="Enter your guess..."
            value={value}
            className="attached-right shadow-none"
            onChange={e => setValue(e.target.value)}
          />
          <button className="btn attached-left">submit</button>
        </form>
      </div>
    </div>
  );
};

export default RoundQuestionCard;
