import { gql } from "@apollo/client";
import createApolloClient from "../../lib/apolloClient";

export const client = createApolloClient();

const GET_ROOM = gql`
  query Room($questionId: uuid!) {
    room(where: { questions: { id: { _eq: $questionId } } }) {
      users {
        id
      }
      round
      questions(order_by: { created_at: desc_nulls_last }) {
        id
        name
        description
        responses(order_by: { created_at: desc_nulls_last }) {
          owner_id
        }
      }
    }
  }
`;

const SUBMIT_ANSWER = gql`
  mutation SubmitAnswer(
    $questionId: uuid!
    $ownerId: String!
    $answer: Int!
    $roomState: String!
  ) {
    insert_response(
      objects: [
        { value: $answer, owner_id: $ownerId, question_id: $questionId }
      ]
    ) {
      affected_rows
    }
    update_room(
      where: { questions: { id: { _eq: $questionId } } }
      _set: { state: $roomState }
    ) {
      returning {
        round
      }
    }
  }
`;

export default async function submitAnswer(req, res) {
  const body = JSON.parse(req.body);
  const currentStateResp = await client.query({
    query: GET_ROOM,
    variables: {
      questionId: req.query.questionId,
    },
  });
  const room = currentStateResp?.data?.room?.[0];

  if (!room) {
    return res
      .status(404)
      .send(`question id: ${req.query.questionId} not found`);
  }
  const question = room.questions.find((x) => x.id === req.query.questionId);
  const users = room.users;
  const responseOwnerIds = new Set(question.responses.map((x) => x.owner_id));
  const userIds = new Set(users.map((x) => x.id));
  const difference = new Set(
    [...userIds].filter((x) => !responseOwnerIds.has(x))
  );

  if (responseOwnerIds.has(req.query.ownerId)) {
    return res.status(400).send("already answered");
  }
  let roomState = "guessing";
  if (difference.size === 1 && difference.has(req.query.ownerId)) {
    roomState = "revealing";
  }

  const submitAnswerResp = await client.mutate({
    mutation: SUBMIT_ANSWER,
    variables: {
      questionId: req.query.questionId,
      ownerId: req.query.ownerId,
      answer: body.answer,
      roomState: roomState,
    },
  });

  return res.status(200).json({
    foo: "bar",
  });
}
