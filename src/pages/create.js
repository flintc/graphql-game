import TodoPrivateWrapper from "../components/Todo/TodoPrivateWrapper";
import TodoPublicWrapper from "../components/Todo/TodoPublicWrapper";
import OnlineUsersWrapper from "../components/OnlineUsers/OnlineUsersWrapper";
import { useUser } from "../user-context";
// import { gql, useMutation } from "@apollo/client";
import axios from "axios";
import fetch from "isomorphic-unfetch";
import { useMutation, useQuery } from "react-query";
import { createMachine } from "xstate";
import { useMachine } from "@xstate/react";
import { useUpsertRoomWithUser } from "../lib/useUpsertRoomWithUser";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const startGameMachine = createMachine({
  id: "startGame",
  initial: "idle",
  states: {
    idle: { on: { CREATE: "creating", JOIN: "joining" } },
    joining: {},
    creating: {},
  },
});

function generateRoomCode(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const CreateRoomForm = ({ roomCode }) => {
  const user = useUser();
  const router = useRouter();
  const [upsertRoomWithUser, { data, loading, called, error }] =
    useUpsertRoomWithUser({
      onCompleted: (data) => {
        router.push("/");
      },
    });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        upsertRoomWithUser({
          variables: {
            roomName: roomCode,
            userId: user.id,
            userName: e.target.elements.nickname.value,
          },
          onCompleted: () => {
            router.push("/");
          },
        });
      }}
    >
      <input defaultValue={roomCode} disabled />
      <input id="nickname" placeholder="Name" defaultValue={user.name} />
      <button
        onClick={() => {
          router.back();
        }}
      >
        Cancel
      </button>
      <button disabled={loading || error}>
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

const Create = () => {
  const { data, loading, error } = useQuery("roomCode", async () => {
    const resp = await fetch("/api/generateRoomCode");
    const data = await resp.json();
    return data;
  });
  return (
    <div>
      home page
      {data && <CreateRoomForm roomCode={data.roomCode} />}
    </div>
  );
};

const IndexPage = () => {
  const user = useUser();
  if (user.room) {
    return (
      <div>
        <div>You're already playing a game!</div>
        <div>
          <button>Leave game</button>
          OR
          <Link href="/">Play</Link>
        </div>
      </div>
    );
  }
  return <Create />;
};

export default IndexPage;
