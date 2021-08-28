import { discoverMovies } from "../client/queryClient";

export const getServerSideProps = async (ctx) => {
  const resp = await discoverMovies(ctx.params);
  console.log("movies getServerSideProps", resp);
  return { props: resp };
};

export default function MoviesPage({ results }) {
  return (
    <div>
      hello!
      {/* {JSON.stringify(props)} */}
      {results.map((result) => {
        return <div>{result.title}</div>;
      })}
    </div>
  );
}
