import { gql, useApolloClient } from "@apollo/client";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useUser } from "../shared/user-context";

const USER_STARRED = gql`
  query User($userId: String!) {
    user: user_by_pk(id: $userId) {
      id
      name
      starred
    }
  }
`;

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

const REMOVE_STAR = gql`
  mutation UserRemoveStar($userId: String!, $mediaId: String) {
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

function useUserStarred() {
  const user = useUser();
  const client = useApolloClient();
  const queryClient = useQueryClient();

  const starredQuery = useQuery(
    ["user", user?.id, "starred"],
    async ({ queryKey }) => {
      const [, userId] = queryKey;
      const resp = await client.query({
        query: USER_STARRED,
        variables: {
          userId: userId,
        },
      });
      return resp.data.user.starred;
    },
    {
      staleTime: 100000 * 60 * 60,
      enabled: user !== null,
    }
  );

  // Always refetch after error or success:
  const onSettled = () => {
    setTimeout(() => {
      queryClient.invalidateQueries(["user", user.id, "starred"]);
    }, 1000);
  };

  // If the mutation fails, use the context returned from onMutate to roll back
  const onError = (err, mediaId, context) => {
    queryClient.setQueryData(
      ["user", user.id, "starred"],
      context.previousStarred
    );
  };

  const addStarMutation = useMutation({
    mutationKey: ["user", user?.id, "starred"],
    mutationFn: async (mediaId) => {
      const resp = await client.mutate({
        mutation: ADD_STAR,
        variables: {
          userId: user.id,
          mediaId: mediaId,
        },
      });
      return resp.data.update_user.returning.starred;
    },
    // When mutate is called:
    onMutate: async (mediaId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["user", user.id, "starred"]);

      // Snapshot the previous value
      const previousStarred = queryClient.getQueryData([
        "user",
        user.id,
        "starred",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["user", user.id, "starred"], (old) => [
        ...old,
        mediaId,
      ]);

      // Return a context object with the snapshotted value
      return { previousStarred };
    },
    onError,
    onSettled,
    enabled: user !== null,
  });

  const removeStarMutation = useMutation({
    mutationKey: ["user", user?.id, "starred"],
    mutationFn: async (mediaId, ...args) => {
      const resp = await client.mutate({
        mutation: REMOVE_STAR,
        variables: {
          userId: user.id,
          mediaId: mediaId,
        },
      });
      return resp.data.update_user.returning.starred;
    },
    // When mutate is called:
    onMutate: async (mediaId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries(["user", user.id, "starred"]);

      // Snapshot the previous value
      const previousStarred = queryClient.getQueryData([
        "user",
        user.id,
        "starred",
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(["user", user.id, "starred"], (old) =>
        old.filter((x) => x !== mediaId)
      );

      // Return a context object with the snapshotted value
      return { previousStarred };
    },
    onError,
    onSettled,
    enabled: user !== null,
  });
  return { starredQuery, addStarMutation, removeStarMutation };
}

export { useUserStarred };
