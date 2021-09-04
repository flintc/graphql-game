import { gql, useMutation } from "@apollo/client";

const UPSERT_ROOM_WITH_USER = gql`
  mutation UpsertRoomWithUser(
    $roomName: String!
    $userId: String!
    $userName: String
  ) {
    insert_room(
      objects: [
        {
          name: $roomName
          users: {
            data: [{ id: $userId, name: $userName }]
            on_conflict: {
              constraint: user_pkey
              update_columns: [room_id, name]
            }
          }
        }
      ]
      on_conflict: { constraint: room_name_key, update_columns: [updated_at] }
    ) {
      affected_rows
      returning {
        name
        created_at
        updated_at
        users {
          name
          id
          room {
            name
            id
          }
        }
      }
    }
  }
`;

function useUpsertRoomWithUser(options) {
  return useMutation(UPSERT_ROOM_WITH_USER, options);
}

export { useUpsertRoomWithUser };
