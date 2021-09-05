import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { client, discoverMovies } from "../../../lib/queryClient";

export default function MoviesKeyword() {
  const router = useRouter();
  const { data, status } = useQuery(
    ["movies", "keyword", { with_keywords: `${router.query.id}` }],
    async () => {
      const resp = await client.get(`/keyword/${router.query.id}/movies`);
      return resp.data;
    },
    {
      staleTime: 1000 * 60 * 1000,
      // keepPreviousData: true,
      // placeholderData: initialData,
      // enabled: queryP
    }
  );
  console.log("keyyy", status, data);

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Error: {data.error}</p>;
  }
  return (
    <div>
      <h1>{router.query.id}</h1>
      <ul>
        {data.results.map((movie) => (
          <li key={movie.id}>
            <Link href={{ pathname: `/movies/[id]`, query: { id: movie.id } }}>
              <a className="text-gray-11">{movie.title}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
