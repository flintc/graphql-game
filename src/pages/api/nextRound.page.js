import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";
const client = createApolloClient();

const GET_ROOM = gql`
  query Room($roomName: String!) {
    room(where: { name: { _eq: $roomName } }) {
      state
      round
    }
  }
`;

const NEXT_ROUND = gql`
  mutation NextRound($roomName: String!) {
    update_room(
      where: { name: { _eq: $roomName } }
      _inc: { round: 1 }
      _set: { state: "selecting" }
    ) {
      returning {
        round
      }
    }
  }
`;

export default async function nextRound(req, res) {
  const currentStateResp = await client.query({
    query: GET_ROOM,
    variables: {
      roomName: req.query.roomName,
    },
  });
  const room = currentStateResp.data.room?.[0];
  if (!room) {
    return res.status(404).send(`room code: ${req.query.roomName} not found`);
  }
  if (room.state !== "revealing") {
    return res
      .status(400)
      .send(
        `Cannot start next round. Invalid state transition ${room.state} => 'selecting'`
      );
  }
  const nextRoundResp = await client.mutate({
    mutation: NEXT_ROUND,
    variables: {
      roomName: req.query.roomName,
    },
  });
  return res.status(200).json(nextRoundResp.data.update_room.returning);
}
