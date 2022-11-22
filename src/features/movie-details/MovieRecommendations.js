import Link from "next/link";
import { useMovieRecommendations } from "../../entities/movie";

export function MovieRecommendations({ movieId }) {
  const { data, status } = useMovieRecommendations(movieId);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  if (status === "error") {
    return <div>Error</div>;
  }
  return (
    <div className="pb-4">
      <div className="px-2 mb-2 text-gray-12">Recommended</div>
      <div className="inline-flex gap-4 overflow-x-auto">
        {data.results.map((movie) => {
          return (
            <div className="flex-none inline-block" key={movie.id}>
              <Link
                href={{ pathname: "/movies/[id]", query: { id: movie.id } }}
                scroll={false}
              >
                <a>
                  <img
                    className="w-40 rounded-lg"
                    alt={movie.title}
                    src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                  />
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
