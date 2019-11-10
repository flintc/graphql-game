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
import { computeScore, generateCode } from "./utils";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const Context = React.createContext();

const JoinForm = ({ handleSubmit }) => {
  const [code, setCode] = useState(null);
  const [name, setName] = useState(null);
  console.log("name", name);
  return (
    <form onSubmit={e => handleSubmit(e, { name, code })}>
      <div className="form-field" j>
        <label htmlFor="name-input" className="form-label">
          NAME
        </label>
        <input
          id="name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div className="form-field">
        <label htmlFor="room-input" className="form-label">
          ROOM
        </label>
        <input
          id="room-input"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Room Code"
        />
      </div>
      <div className="btn-group">
        <button className="btn">go back</button>
        <button className="btn">submit</button>
      </div>
    </form>
  );
};

const CreateForm = ({ handleSubmit }) => {
  const [name, setName] = useState(null);
  const code = generateCode();
  const history = useHistory();
  return (
    <form onSubmit={e => handleSubmit(e, { name, code })}>
      <div className="form-field">
        <label htmlFor="name-input" className="form-label">
          NAME
        </label>
        <input
          id="name-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
      </div>
      <div className="btn-group">
        <button
          onClick={() => {
            history.push("/");
          }}
          className="btn"
        >
          go back
        </button>
        <button className="btn">submit</button>
      </div>
    </form>
  );
};

const Users = ({ data, responses }) => {
  return (
    <div className="fixed bottom-0 w-screen overflow-auto whitespace-no-wrap pb-2 px-4 text-center">
      {data.map(user => {
        const answered = L.get(
          [L.whereEq({ owner: { id: user.id } })],
          responses
        );
        const cls = answered
          ? "badge px-6 py-2 mr-4 inline-block"
          : "badge-gray px-6 py-2 mr-4 inline-block";
        console.log(cls);
        console.log("answered?", user, responses, answered);
        return (
          <span className={cls} key={user.id}>
            {user.name}
          </span>
        );
      })}
    </div>
  );
};

const Result = ({ guess, answer }) => {
  return (
    <div>
      <div>Your Answer: {guess}</div>
      <div>Correct Answer: {answer}</div>
      <div>Score: {computeScore(guess, answer)}</div>
    </div>
  );
};

const ExistingQuestion = ({ data, roundOver, onEndGame }) => {
  const { user } = useContext(Context);
  const [value, setValue] = useState(null);
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const userResponse = L.get(
    [L.whereEq({ owner: { id: user.id } })],
    data.responses
  );
  if (!userResponse) {
    console.log("q data", data);
    return (
      <div className="shadow rounded-lg border shadow-2xl bg-white w-8/12 sm:w-2/3 lg:w-1/2 xl:w-1/3 pb-4">
        <div className="showit relative" style={{ height: "calc(55vh)" }}>
          <img
            className="blurme absolute top-0 object-cover rounded-t-lg w-full"
            src={data.imageUrl}
            style={{ height: "calc(55vh)" }}
          />
          <p
            className="p-4 absolute top-0 text-gray-800 text-lg showme rounded-t-lg w-full"
            style={{ height: "100%", overflowY: "scroll" }}
          >
            {data.description}
          </p>
        </div>
        <div className="rounded-b-lg p-2">
          <h1 className="text-gray-700">{data.name}</h1>
          <form
            className="flex flex-row w-full "
            onSubmit={e => {
              e.preventDefault();
              submitResponse({
                variables: {
                  userId: user.id,
                  questionId: data.id,
                  value
                }
              });
            }}
          >
            <input
              placeholder="Enter your guess..."
              value={value}
              className="attached-right shadow-none"
              onChange={e => setValue(e.target.value)}
            />
            <button className="btn attached-left">submit</button>
          </form>
        </div>
      </div>
    );
  }
  if (data.answer && roundOver) {
    return (
      <>
        <Result
          guess={userResponse.value}
          answer={data.answer.score.rottenTomatoes}
        />
        <div className="btn-group">
          <button
            className="btn"
            onClick={() => {
              nextRound({ variables: { roomId: data.room.id } });
            }}
          >
            next round
          </button>
          <button className="btn" onClick={onEndGame}>
            end game
          </button>
        </div>
      </>
    );
  }
  return (
    <div>
      <span>Current Answer: {userResponse.value}</span>
      <button className="btn">end round</button>
    </div>
  );
};

const Question = ({ data, nUsers, roomId }) => {
  const history = useHistory();
  const [question, setQuestion] = useState(null);
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [roundOver, setRoundOver] = useState(false);
  console.log("data.responses", data);
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
      <ExistingQuestion
        data={data}
        roundOver={roundOver}
        onEndGame={onEndGame}
      />
    );
  }
  const handleSubmit = e => {
    e.preventDefault();
    fetch(searchUrl(question))
      .then(async resp => {
        const json = await resp.json();
        console.log("here2", json);
        submitQuestion({
          variables: {
            roomId: roomId,
            description: json.description,
            imageUrl: json.poster,
            name: json.title,
            answer: json.reception
          }
        });
        setQuestion(null);
      })
      .catch(err => {
        console.error("error!", err);
      });
  };
  return (
    <div>
      <form className="flex flex-row" onSubmit={handleSubmit}>
        <div className="flex flex-row">
          <input
            placeholder="Search movie titles..."
            value={question}
            className="attached-right shadow-none"
            onChange={e => setQuestion(e.target.value)}
          />
          <button className="btn attached-left">submit</button>
        </div>
      </form>
    </div>
  );
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
      <Users
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
};

const Score = ({ data }) => {
  const { user } = useContext(Context);
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

const ScorePage = ({
  match: {
    params: { name }
  }
}) => {
  const { user } = useContext(Context);
  return "here";
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
  const { user, setUser } = useContext(Context);
  const [userName, setUserName] = useState();
  const [room, setRoom] = useState({});
  const history = useHistory();
  const [joinRoom, joinRoomResp] = useMutation(docs.JOIN_ROOM_MUTATION);
  const [roomByName, roomByNameResp] = useLazyQuery(docs.ROOM_BY_NAME_QUERY);
  const [createRoom, createRoomResp] = useMutation(docs.CREATE_ROOM_MUTATION);
  useEffect(() => {
    if (!roomByNameResp.loading) {
      if (roomByNameResp.data && roomByNameResp.data.room.length) {
        setRoom(roomByNameResp.data.room[0]);
      }
    }
  }, [roomByNameResp]);

  useEffect(() => {
    if (room.id) {
      joinRoom({ variables: { name: userName, roomId: room.id } });
    }
  }, [room.id, userName, joinRoom]);

  useEffect(() => {
    if (joinRoomResp.data) {
      setUser(joinRoomResp.data.insert_user.returning[0]);
    }
  }, [joinRoomResp.data, setUser, history]);

  useEffect(() => {
    if (user) {
      history.push(`/game/${user.room.name}`);
    }
  }, [user, history]);

  useEffect(() => {
    if (createRoomResp.data) {
      setUser(createRoomResp.data.insert_user.returning[0]);
    }
  }, [createRoomResp, setUser]);

  const handleSubmit = (e, { name, code }) => {
    e.preventDefault();
    if (state === "join") {
      roomByName({ variables: { name: code } });
      setUserName(name);
    } else if (state === "create") {
      createRoom({ variables: { userName: name, roomName: code } });
    }
  };

  if (!state) {
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
  } else if (state === "join") {
    return <JoinForm handleSubmit={handleSubmit} />;
  } else if (state === "create") {
    return <CreateForm handleSubmit={handleSubmit} />;
  }
};

const StateProvider = ({ children }) => {
  const [user, setUser] = useState();
  return (
    <Context.Provider value={{ user, setUser }}>{children}</Context.Provider>
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
    <Context.Provider value={{ user: { id: "user-id", name: "Frank" } }}>
      <Route path="/components/join" component={JoinForm} />
      <Route path="/components/create" component={CreateForm} />
      <Route path="/components/users">
        <Users data={users} />
      </Route>
      <Route path="/components/question">
        <ExistingQuestion data={{ id: "some-id" }} />
      </Route>
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
    </Context.Provider>
  );
};

const Routes = () => {
  const { user } = useContext(Context);
  return (
    <div className="app">
      <Route path="/" exact>
        <Main />
      </Route>
      <Components />
      <ProtectedRoute
        path="/game/:name"
        component={RoomPage}
        loggedIn={user ? true : false}
      />
      <ProtectedRoute
        path="/game/:name/score"
        component={ScorePage}
        loggedIn={user ? true : false}
      />
    </div>
  );
};

function App() {
  return (
    <ApolloProvider client={client}>
      <StateProvider>
        <Router basename="/">
          <Switch>
            <Routes />
          </Switch>
        </Router>
      </StateProvider>
    </ApolloProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
