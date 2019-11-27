import React from "react";
import { Route } from "react-router-dom";
import { StateContext } from "./app-state";
import MovieSearchInput from "./components/MovieSearchInput";
import RoomCreateForm from "./components/RoomCreateForm";
import RoomJoinForm from "./components/RoomJoinForm";
import RoundQuestionCard from "./components/RoundQuestionCard";
import UserList from "./components/UserList";
import Room from "./components/Room";

const ComponentsWithMocks = () => {
  const users = [
    { name: "Carol", id: "carol-id" },
    { name: "Bob", id: "bob-id" },
    { name: "Bob", id: "bob-id" },
    { name: "Bob", id: "bob-id" },
    { name: "Bob", id: "bob-id" },
    { name: "Bob", id: "bob-id" }
  ];
  return (
    <StateContext.Provider value={{ user: { id: "user-id", name: "Frank" } }}>
      <Route path="/components/join" component={RoomJoinForm} />
      <Route path="/components/create" component={RoomCreateForm} />
      <Route path="/components/users">
        <UserList data={users} />
      </Route>
      <Route path="/components/question">
        <RoundQuestionCard data={{ id: "some-id" }} />
      </Route>
      <Route path="/components/search" component={MovieSearchInput} />
      <Route path="/components/room">
        <Room
          data={{
            name: "ABCD",
            questions: [
              {
                // name: "The Terminal",
                // imageUrl:
                //   "https://upload.wikimedia.org/wikipedia/en/8/86/Movie_poster_the_terminal.jpg",
                name: "The Matrix",
                imageUrl:
                  "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
                description:
                  'The Matrix is a 1999 science fiction action film[3][4] written and directed by the Wachowskis.[a] It stars Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano and is the first installment in the Matrix franchise. It depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, created by intelligent machines to distract humans while using their bodies as an energy source.[5] When computer programmer Thomas Anderson, under the hacker alias "Neo", uncovers the truth, he "is drawn into a rebellion against the machines"[5] along with other people who have been freed from the Matrix.',
                responses: [{ owner: { id: "carol-id" } }]
              }
            ],
            round: 0,
            users
          }}
        />
      </Route>
    </StateContext.Provider>
  );
};

export default ComponentsWithMocks;
