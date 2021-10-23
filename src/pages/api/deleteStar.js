import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";
const client = createApolloClient();

const DELETE_STAR = gql`
  mutation UserDeleteStar($userId: String!, $mediaId: String) {
    update_user(
      where: { id: { _eq: $userId } }
      _delete_key: { starred: $mediaId }
    ) {
      returning {
        id
        name
        starred
      }
    }
  }
`;

export default async function deleteStar(req, res) {
  const resp = await client.mutate({
    mutation: DELETE_STAR,
    variables: {
      userId: req.query.userId,
      mediaId: req.query.mediaId,
    },
  });

  return res.status(200).json(resp.data.update_user.returning);
}
