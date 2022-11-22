import { KeyWordPill } from "../../entities/keyword";
import { useKeywords } from "../../entities/movie";

function MovieKeywords({ movie }) {
  const { data, status } = useKeywords(movie.id);
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Unable to get keywords for this title</p>;
  }

  return (
    <div className="px-2 mt-2">
      <div className="font-medium uppercase text-gray-12 ">Keywords:</div>
      <div className="flex flex-wrap justify-start gap-2 mt-2 text-sm text-gray-11">
        {data.keywords.map((keyword) => {
          return <KeyWordPill key={keyword.id} {...keyword} />;
        })}
      </div>
    </div>
  );
}

export { MovieKeywords };
