import {
  useLazyQuery,
  useMutation,
  useSubscription
} from "@apollo/react-hooks";
import * as L from "partial.lenses";
import * as R from "ramda";
import React, { useContext, useEffect, useState } from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Switch,
  useHistory
} from "react-router-dom";
import client from "./client";
import * as docs from "./documents";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/tailwind.css";
import "./styles/custom.css";
import { computeScore } from "./utils";
import RoomJoinForm from "./components/RoomJoinForm";
import RoomCreateForm from "./components/RoomCreateForm";
import UserList from "./components/UserList";
import MovieSearchInput from "./components/MovieSearchInput";
import RoundQuestionCard from "./components/RoundQuestionCard";
import { StateContext } from "./app-state";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomJoinPage from "./pages/RoomJoinPage";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const Question = ({ data, nUsers, roomId }) => {
  const history = useHistory();
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [roundOver, setRoundOver] = useState(false);
  const onEndGame = () => {
    history.push(`/game/${data.room.name}/score`);
  };
  useEffect(() => {
    if (data && nUsers === data.responses.length) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [data, nUsers]);
  if (data) {
    return (
      <RoundQuestionCard
        data={data}
        roundOver={roundOver}
        onEndGame={onEndGame}
      />
    );
  }
  const handleSelected = title => {
    fetch(searchUrl(title))
      .then(async resp => {
        const json = await resp.json();
        submitQuestion({
          variables: {
            roomId: roomId,
            description: json.description,
            imageUrl: json.poster,
            name: json.title,
            answer: json.reception
          }
        });
      })
      .catch(err => {
        console.error("error!", err);
      });
  };
  return <MovieSearchInput onSelect={handleSelected} />;
};

const Room = ({ data }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full pb-0">
      <Question
        data={data.questions[data.round]}
        roomId={data.id}
        nUsers={data.users.length}
      />
      <Score data={data.questions} />
      <UserList
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
};

const Score = ({ data }) => {
  const { user } = useContext(StateContext);
  const scores = data.map(question => {
    const guess = L.get(
      ["responses", L.whereEq({ owner: { id: user.id } }), "value"],
      question
    );
    const answer = L.get(["answer", "score", "rottenTomatoes"], question);
    if (R.all(R.complement(R.isNil), [answer, guess])) {
      console.log("score....", guess, answer);
      return computeScore(guess, answer);
    }
  });
  return `score: ${R.sum(R.filter(R.identity, scores))}`;
};

const RoomPage = ({
  match: {
    params: { name }
  }
}) => {
  const resp = useSubscription(docs.SUBSCRIBE_TO_ROOM_BY_NAME, {
    variables: { name }
  });
  if (resp.loading) {
    return "Loading...";
  }
  return <Room data={resp.data.room[0]} />;
};

const Main = () => {
  const [state, setState] = useState();
  const history = useHistory();
  useEffect(() => {
    if (state === "join") {
      history.push("/join");
    } else if (state === "create") {
      history.push("/create");
    }
  }, [state]);
  return (
    <div className="px-10">
      <h1>Do you want to play a game?</h1>
      <div className="btn-group">
        <button className="btn" onClick={() => setState("create")}>
          create
        </button>
        <button className="btn" onClick={() => setState("join")}>
          join
        </button>
      </div>
    </div>
  );
};

const StateProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState();
  useEffect(() => {
    if (user) {
      history.push(`/game/${user.room.name}`);
    }
  }, [user]);
  return (
    <StateContext.Provider value={{ user, setUser }}>
      {children}
    </StateContext.Provider>
  );
};

const Components = () => {
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

const Routes = () => {
  const { user } = useContext(StateContext);
  return (
    <div className="app">
      <Route path="/" exact>
        <Main />
      </Route>
      <Components />
      <Route path="/join" component={RoomJoinPage} />
      <Route path="/create" component={RoomCreatePage} />
      <ProtectedRoute
        path="/game/:name"
        component={RoomPage}
        loggedIn={user ? true : false}
      />
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <Router basename="/">
        <Switch>
          <StateProvider>
            <Routes />
          </StateProvider>
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
