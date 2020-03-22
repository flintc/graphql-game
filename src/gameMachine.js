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
  const roomId = roomObservable.pipe(
    distinctUntilChanged(R.eqBy(R.prop("id"))),
    map(toEvent("ROOM_ID", { id: ["id"], name: ["name"] }))
  );
  const users = roomObservable.pipe(
    map(L.collect(["users", L.elems, R.pick(["id", "name"])])),
    distinctUntilChanged(R.eqBy(R.length)),
    map(value => ({ type: "PLAYERS_UPDATE", users: value }))
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
  const newResponse = roundObservable.pipe(
    map(L.get(["question", "responses"])),
    filter(R.length),
    map(value => {
      console.log("?????", value);
      return value;
    }),
    distinctUntilChanged(R.eqBy(R.length)),
    scan((prev, current) => {
      console.log("??????", prev, current, R.difference(current, prev));
      return R.difference(current, prev);
    }),
    map(toEvent("NEW_RESPONSE", { response: [0] }))
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
  return merge(
    roomId,
    roundChange,
    questionSelected,
    newResponse,
    answered,
    roundOver,
    users
  );
};

export const gameMachine = Machine({
  initial: "initializing",
  invoke: {
    src: stateObservable
  },
  context: {
    score: 0,
    users: [],
    responses: []
  },
  states: {
    initializing: {
      on: {
        ROOM_ID: {
          actions: assign({ id: (_, e) => e.id, name: (_, e) => e.name })
        },
        ROUND_CHANGED: {
          actions: [assign({ round: (ctx, e) => e.round })],
          target: "selecting"
        }
      }
    },
    selecting: {
      on: {
        QUESTION_SELECTED: {
          actions: [
            (ctx, e) => console.log("question selected", e),
            assign({ question: (_, e) => e.question })
          ],
          target: "answering"
        }
      }
    },
    answering: {
      on: {
        ANSWERED: {
          actions: assign({ answer: (ctx, e) => e.answer }),
          target: "answered"
        },
        NEW_RESPONSE: {
          actions: [
            assign({
              responses: (ctx, e) => R.append(e.response, ctx.responses),
              users: (ctx, e) =>
                L.modify(
                  L.whereEq({ id: e.response.owner.id }),
                  R.assoc("answered", true),
                  ctx.users
                )
            })
          ]
        }
      }
    },
    answered: {
      on: {
        ROUND_OVER: {
          actions: [
            assign({
              score: (ctx, e) => {
                console.log(
                  "...",
                  typeof ctx.answer,
                  typeof ctx.question.answer.rottenTomatoes
                );
                const diff = Math.abs(
                  ctx.answer - ctx.question.answer.score.rottenTomatoes
                );
                console.log("---", diff);
                return ctx.score + (diff === 0 ? -5 : diff);
              }
            })
          ],
          target: "roundSummary"
        }
      }
    },
    roundSummary: {
      on: {
        ROUND_CHANGED: "selecting",
        NEXT_ROUND: "initializing",
        GAME_OVER: "gameSummary"
      }
    },
    gameSummary: {}
  },
  on: {
    PLAYERS_UPDATE: {
      actions: [
        (ctx, e) => console.log("MY PLAYERS UPDATE", e),
        assign({ users: (ctx, e) => e.users })
      ]
    }
  }
});
