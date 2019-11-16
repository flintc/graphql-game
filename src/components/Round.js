import React, { useEffect, useState } from "react";
import MovieSearch from "./MovieSearch";
import RoundQuestionCard from "./RoundQuestionCard";

const Round = ({ data, nUsers, roomId }) => {
  const [roundOver, setRoundOver] = useState(false);
  const onEndGame = () => console.log("done.");
  useEffect(() => {
    if (data && nUsers === data.responses.length) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [data, nUsers]);
  if (data) {
    return (
      <RoundQuestionCard
        data={data}
        roundOver={roundOver}
        onEndGame={onEndGame}
      />
    );
  }
  return <MovieSearch roomId={roomId} />;
};

export default Round;
