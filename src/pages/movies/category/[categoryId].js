import { useRouter } from "next/router";
// import { useMovieScore } from "../../lib/useMovieScore";
// import { useMovie } from "../../lib/useMovie";
import { discoverMovies } from "../../../lib/queryClient";
import { useQuery } from "react-query";
import Link from "next/link";
export default function MovieDetailsPage(props) {
  const router = useRouter();
  // const { data } = useMovie(router.query.id);
  // const scores = useMovieScore(data);

  const { data } = useQuery(
    ["browse", "movies", { with_genres: router.query.categoryId }],
    ({ queryKey }) => {
      const [, , params] = queryKey;
      return discoverMovies(params);
    },
    {
      // staleTime: 100 * 60 * 1000,
      // keepPreviousData: true,
      // placeholderData: initialData,
      // enabled: queryP
    }
  );

  return (
    <div>
      {data?.results?.map((movie) => {
        return (
          <Link
            passHref
            key={movie.id}
            href={{
              pathname: "/movies/[id]",
              query: { id: movie.id },
            }}
          >
            <div key={movie.id}>
              <h1>{movie.title}</h1>
              <p>{movie.overview}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
