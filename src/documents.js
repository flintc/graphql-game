import gql from "graphql-tag";

export const JOIN_ROOM_MUTATION = gql`
  mutation CreateUser($name: String, $roomId: uuid) {
    insert_user(objects: [{ name: $name, room_id: $roomId }]) {
      affected_rows
      returning {
        id
        name
        room {
          name
          id
        }
      }
    }
  }
`;

export const USERS_IN_ROOM_SUBSCRIPTION = gql`
  subscription UsersInRoomSubscription($roomName: String) {
    user(where: { room: { name: { _eq: $roomName } } }) {
      id
      name
    }
  }
`;

export const USERS_IN_ROOM_QUERY = gql`
  query UsersInRoomQuery($roomName: String) {
    user(where: { room: { name: { _eq: $roomName } } }) {
      id
      name
    }
  }
`;

export const ROOM_QUERY = gql`
  query Room($name: String) {
    room(where: { name: { _eq: $name } }, distinct_on: name) {
      id
      name
      questions(order_by: { created_at: desc }) {
        id
        name
        created_at
        answer
        responses {
          value
          owner {
            name
          }
        }
      }
      users {
        id
        name
      }
    }
  }
`;

export const SUBSCRIBE_TO_ROOM = gql`
  subscription SubscribeToRoom($roomId: uuid!) {
    room_by_pk(id: $roomId) {
      questions(order_by: { created_at: desc }) {
        id
        name
        created_at
        answer
        responses {
          value
          owner {
            name
          }
        }
      }
      users {
        id
        name
      }
    }
  }
`;

export const SUBSCRIBE_TO_ROOM_BY_NAME = gql`
  subscription SubscribeToRoom($name: String) {
    room(where: { name: { _eq: $name } }) {
      id
      state
      name
      round
      questions(order_by: { created_at: asc }) {
        id
        name
        state
        created_at
        answer
        room {
          id
          round
        }
        responses {
          value
          owner {
            id
            name
          }
        }
      }
      users {
        id
        name
      }
    }
  }
`;

export const ROOM_BY_NAME_QUERY = gql`
  query FindRoomByName($name: String) {
    room(where: { name: { _eq: $name } }) {
      id
      name
    }
  }
`;

// export const CREATE_ROOM_MUTATION = gql`
//   mutation CreateRoom($roomName: String, $userName: String) {
//     insert_room(
//       objects: [{ name: $roomName, users: { data: [{ name: $userName }] } }]
//     ) {
//       returning {
//         id
//       }
//       affected_rows
//     }
//   }
// `;

export const GET_RESPONSE_FOR_QUESTION_QUERY = gql`
  query GetAnswer($questionId: uuid, $userId: uuid) {
    response(
      limit: 1
      where: { question_id: { _eq: $questionId }, owner_id: { _eq: $userId } }
    ) {
      id
      value
    }
  }
`;

export const SUBMIT_RESPONSE_FOR_QUESTION = gql`
  mutation SubmitAnswer($questionId: uuid, $userId: uuid, $value: Int) {
    insert_response(
      objects: [{ question_id: $questionId, owner_id: $userId, value: $value }]
    ) {
      affected_rows
      returning {
        id
        value
      }
    }
  }
`;

export const RESPONSE_FOR_QUESTION_SUBSCRIPTION = gql`
  subscription SubscribeToAnswer($questionId: uuid, $userId: uuid) {
    response(
      where: { question_id: { _eq: $questionId }, owner_id: { _eq: $userId } }
      order_by: { created_at: desc }
      limit: 1
    ) {
      id
      value
      question {
        name
        answer
      }
    }
  }
`;

export const CREATE_ROOM_MUTATION = gql`
  mutation CreateRoomAndUser($userName: String, $roomName: String) {
    insert_user(
      objects: [{ name: $userName, room: { data: { name: $roomName } } }]
    ) {
      affected_rows
      returning {
        id
        name
        room {
          name
          id
        }
      }
    }
  }
`;
export const SUBMIT_QUESTION_MUTATION = gql`
  mutation SubmitQuestion(
    $roomId: uuid!
    $name: String
    $description: String
    $imageUrl: String
    $answer: json
  ) {
    insert_question(
      objects: [
        {
          room_id: $roomId
          name: $name
          description: $description
          imageUrl: $imageUrl
          answer: $answer
        }
      ]
    ) {
      affected_rows
      returning {
        id
        name
      }
    }
  }
`;

export const NEXT_ROUND_MUTATION = gql`
  mutation NextRound($roomId: uuid) {
    update_room(_inc: { round: 1 }, where: { id: { _eq: $roomId } }) {
      returning {
        id
      }
    }
  }
`;
