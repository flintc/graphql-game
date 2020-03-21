import React from "react";
import { Machine, assign } from "xstate";
import { from, merge } from "rxjs";
import { map, filter, take, scan, distinctUntilChanged } from "rxjs/operators";
import * as docs from "./documents";
import gql from "graphql-tag";
import Observable from "zen-observable";
import * as R from "ramda";
import * as L from "partial.lenses";

const toEvent = (eventType, mapFn = {}) => value => ({
  type: eventType,
  ...L.get(L.pick(mapFn), value)
});

const stateObservable = ctx => {
  const roomObservable = from(
    ctx.client.subscribe({
      query: docs.SUBSCRIBE_TO_ROOM_BY_NAME,
      variables: { name: ctx.roomName }
    })
  ).pipe(map(value => value.data.room[0]));
  const roundObservable = roomObservable.pipe(
    filter(value => value.questions[value.round]),
    map(value => R.assoc("question", value.questions[value.round], value))
  );

  const users = roomObservable.pipe(
    distinctUntilChanged(R.eqBy(R.path(["users", "length"]))),
    map(
      toEvent("PLAYERS_UPDATE", {
        data: "users"
      })
    )
  );
  const roundChange = roomObservable.pipe(
    distinctUntilChanged(R.eqBy(R.prop("round"))),
    map(
      toEvent("ROUND_CHANGED", {
        round: ["round"]
      })
    )
  );

  const questionSelected = roundObservable.pipe(
    distinctUntilChanged(R.eqBy(R.path(["questions", "length"]))),
    map(
      toEvent("QUESTION_SELECTED", {
        question: ["question"]
      })
    )
  );
  const ownedByUser = L.whereEq({
    owner: { id: ctx.userId }
  });

  const answered = roundObservable.pipe(
    filter(L.get(["question", ownedByUser])),
    map(
      toEvent("ANSWERED", {
        answer: ["question", ownedByUser, "value"]
      })
    )
  );
  const roundOver = roundObservable.pipe(
    filter(
      R.converge(R.eqBy(R.length), [
        R.path(["question", "responses"]),
        R.path(["users"])
      ])
    ),
    map(toEvent("ROUND_OVER"))
  );
  return merge(roundChange, questionSelected, answered, roundOver, users);
};

export const gameMachine = Machine({
  initial: "initializing",
  invoke: {
    src: stateObservable
  },
  states: {
    initializing: {
      on: {
        ROUND_CHANGED: {
          actions: [assign({ round: (ctx, e) => e.round })],
          target: "selecting"
        }
      }
    },
    selecting: {
      on: {
        QUESTION_SELECTED: {
          actions: [(ctx, e) => console.log("question selected", e)],
          target: "answering"
        }
      }
    },
    answering: {
      on: {
        ANSWERED: {
          actions: assign({ answer: (ctx, e) => e.answer }),
          target: "answered"
        }
      }
    },
    answered: {
      on: {
        ROUND_OVER: {
          target: "roundSummary"
        }
      }
    },
    roundSummary: {
      on: {
        ROUND_CHANGED: "selecting",
        GAME_OVER: "gameSummary"
      }
    },
    gameSummary: {}
  },
  on: {
    PLAYERS_UPDATE: {
      actions: [
        (ctx, e) => console.log("MY PLAYERS UPDATE", e),
        assign({ players: (ctx, e) => e.data })
      ]
    }
  }
});
