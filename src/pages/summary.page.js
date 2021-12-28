/* eslint-disable @next/next/no-img-element */
import { useUserSubscription } from "../user-subscription";
import LeaveRoomButton from "../components/LeaveRoomButton";
import LogoutBtn from "../components/Auth/Logout";
import Router from "next/router";
import { useMovie } from "../lib/useMovie";
import Image from "next/image";

const MovieCard = ({ movieId, score }) => {
  const { data, status } = useMovie(movieId);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }
  if (status === "idle") {
    return null;
  }
  return (
    <div className="">
      <div className="relative">
        <Image
          width={1280}
          height={720}
          alt={data.title}
          src={`https://image.tmdb.org/t/p/original/${data.backdrop_path}`}
          className="rounded-lg"
        />
        <div
          className="absolute top-[-0.75rem] right-[-0.75rem] grid px-4 py-3 rounded-full bg-secondary-9 place-content-center font-medium"
          style={{
            backgroundColor: score == "- 5" ? "var(--green9)" : undefined,
          }}
        >
          {score}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 text-2xl">
        {data.title}
        {` `}
        {data.release_date && (
          <span className="text-xl whitespace-nowrap">
            ( {data?.release_date?.split("-")?.[0]} )
          </span>
        )}
      </div>
    </div>
  );
};

export function GameSummary({ rounds, roomName }) {
  const total = rounds.reduce((acc, curr) => {
    return acc + parseInt(curr.score.replace(` `, ""));
  }, 0);
  return (
    <div className="flex flex-col gap-10 px-8 mt-4">
      <div className="m-auto text-center">
        <div className="text-base uppercase text-primary-11">Room Code</div>
        <div className="text-6xl uppercase text-gray-12">{roomName}</div>
      </div>
      <div className="flex flex-row items-baseline justify-between text-gray-12">
        <div className="text-2xl">{"Your score:"}</div>
        <div className="text-4xl">{total}</div>
      </div>
      <div className="flex flex-col max-w-2xl gap-6 m-auto">
        {rounds.map((round) => {
          return (
            <MovieCard
              key={round.id}
              movieId={round.questionId}
              answer={round.answer}
              guess={round.guess}
              score={round.score}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function Summary() {
  const user = useUserSubscription();
  const rounds = user?.room?.questions?.map((question) => {
    const response = question.responses.find(
      (response) => response.owner.id === user.id
    );
    const difference = Math.abs(question.answer.value - response.value);
    return {
      score: difference === 0 ? "- 5" : `+ ${difference}`,
      answer: question.answer.value,
      guess: response.value,
      id: question.id,
      questionId: question.questionId,
    };
  });

  return (
    <div className="flex flex-col gap-10">
      {!user && (
        <button
          id="qsLoginBtn"
          variant="primary"
          className="btn-margin loginBtn"
          onClick={() => {
            Router.push("/api/login");
          }}
        >
          Log In
        </button>
      )}
      {user?.room && (
        <GameSummary rounds={rounds} roomName={user?.room?.name} />
      )}
      <div>
        {user?.room && <LeaveRoomButton />}
        {user && <LogoutBtn />}
      </div>
    </div>
  );
}
