import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";
const client = createApolloClient();

const START_GAME = gql`
  mutation StartGame($roomName: String!) {
    update_room(
      where: { name: { _eq: $roomName } }
      _set: { state: "selecting" }
    ) {
      affected_rows
    }
  }
`;

export default async function startGame(req, res) {
  const resp = await client.mutate({
    mutation: START_GAME,
    variables: {
      roomName: req.query.roomName,
    },
  });

  return res.status(200).json(resp.data.update_room.affected_rows);
}
