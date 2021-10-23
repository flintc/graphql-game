import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";
const client = createApolloClient();

const ADD_STAR = gql`
  mutation UserAddStar($userId: String!, $mediaId: jsonb) {
    update_user(
      where: { id: { _eq: $userId } }
      _append: { starred: $mediaId }
    ) {
      returning {
        id
        name
        starred
      }
    }
  }
`;

export default async function addStar(req, res) {
  const resp = await client.mutate({
    mutation: ADD_STAR,
    variables: {
      userId: req.query.userId,
      mediaId: req.query.mediaId,
    },
  });

  return res.status(200).json(resp.data.update_user.returning);
}
