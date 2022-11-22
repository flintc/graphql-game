import ScrollArea from "../../shared/ScrollArea";
import Link from "next/link";
const { useMovieCredits } = require("../../entities/movie");

export const MovieCredits = ({ movieId }) => {
  const { data, status } = useMovieCredits(movieId);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Unable to get credits for this title</p>;
  }
  return (
    <div className="px-2 mt-3">
      <ScrollArea>
        <div className="grid w-full grid-flow-col gap-2 auto-cols-max ">
          {data.cast.map((cast) => {
            return (
              <Link
                key={cast.id}
                href={{
                  pathname: "/people/[id]",
                  query: { id: `${cast.id}` },
                }}
              >
                <a className="px-1.5 py-0.5 rounded-lg block w-full">
                  <div className="flex w-full flex-nowrap">
                    <img
                      alt="foo"
                      className="object-cover object-top scale-[98%] h-12 w-12 mr-2 rounded-md"
                      src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                    />
                    <span className="w-full">{cast.name}</span>
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
