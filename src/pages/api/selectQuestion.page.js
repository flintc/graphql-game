import { gql } from "@apollo/client";
// import { client } from "./submitAnswer";
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

const SELECT_QUESTION = gql`
  mutation SelectQuestion(
    $roomName: String!
    $question: String!
    $questionId: String
    $description: String!
    $answer: json!
  ) {
    insert_room(
      objects: [
        {
          name: $roomName
          state: "guessing"
          questions: {
            data: [
              {
                name: $question
                questionId: $questionId
                description: $description
                answer: $answer
              }
            ]
          }
        }
      ]
      on_conflict: { constraint: room_name_key, update_columns: [state] }
    ) {
      affected_rows
      returning {
        state
      }
    }
  }
`;

export default async function selectQuestion(req, res) {
  const body = JSON.parse(req.body);
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
  if (room.state !== "selecting") {
    return res
      .status(400)
      .send(
        `Cannot select question. Invalid state transition ${room.state} => 'guessing'`
      );
  }
  const selectQuestiondResp = await client.mutate({
    mutation: SELECT_QUESTION,
    variables: {
      roomName: req.query.roomName,
      question: body.question,
      questionId: String(body.questionId),
      description: body.description,
      answer: body.answer,
    },
  });
  return res.status(200).json(selectQuestiondResp.data.insert_room.returning);
}
