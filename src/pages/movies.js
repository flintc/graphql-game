import { discoverMovies } from "../client/queryClient";
import { gql, useSubscription } from "@apollo/client";

export const getServerSideProps = async (ctx) => {
  const resp = await discoverMovies(ctx.params);
  console.log("movies getServerSideProps", resp);
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
  console.log("useSubscription", out);
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
