import { discoverMovies } from "../../lib/queryClient";
import { gql, useSubscription } from "@apollo/client";

export const getServerSideProps = async (ctx) => {
  const resp = await discoverMovies(ctx.params);
  return { props: resp };
};

const USER_SUBSCIPTION = gql`
  subscription User {
    user_by_pk(id: "auth0|0123456789") {
      id
      name
      room {
        state
        questions {
          name
          id
          responses {
            value
            owner {
              id
              name
            }
          }
        }
      }
      responses {
        value
      }
    }
  }
`;

export default function MoviesPage({ results }) {
  const out = useSubscription(USER_SUBSCIPTION);
  return (
    <div>
      hello!
      {/* {JSON.stringify(props)} */}
      {results.map((result) => {
        return <div key={result.title}>{result.title}</div>;
      })}
      {results.map((result) => {
        return <div key={`${result.title}-1`}>{result.title}</div>;
      })}
      {results.map((result) => {
        return <div key={`${result.title}-2`}>{result.title}</div>;
      })}
    </div>
  );
}
