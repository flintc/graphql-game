import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";
const client = createApolloClient();

const LEAVE_ROOM = gql`
  mutation LeaveRoom($userId: String!) {
    update_user(where: { id: { _eq: $userId } }, _set: { room_id: null }) {
      affected_rows
      returning {
        id
        name
        room {
          name
        }
      }
    }
  }
`;

export default async function leaveRoom(req, res) {
  const resp = await client.mutate({
    mutation: LEAVE_ROOM,
    variables: {
      userId: req.query.userId,
    },
  });

  return res.status(200).json(resp.data.update_user.returning);
}
