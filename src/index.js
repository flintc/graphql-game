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
    <div>
      {data.map(user => {
        const answered = L.get(
          [L.whereEq({ owner: { id: user.id } })],
          responses
        );
        const cls = answered ? "badge" : "badge-gray";
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

const ExistingQuestion = ({ data, roundOver }) => {
  const { user } = useContext(Context);
  const [value, setValue] = useState(null);
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  const [nextRound] = useMutation(docs.NEXT_ROUND_MUTATION);
  const userResponse = L.get(
    [L.whereEq({ owner: { id: user.id } })],
    data.responses
  );
  if (!userResponse) {
    return (
      <div>
        <h3>Question id: {data.id}</h3>
        <h3>User ID: {user.id}</h3>
        <span>{user.name}'s answer:</span>
        <form
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
            placeholder="Answer"
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <button className="btn">submit</button>
        </form>
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
        <button
          className="btn"
          onClick={() => {
            nextRound({ variables: { roomId: data.room.id } });
          }}
        >
          next round
        </button>
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
  const [question, setQuestion] = useState(null);
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const [roundOver, setRoundOver] = useState(false);
  console.log("data.responses", data);
  useEffect(() => {
    if (data && nUsers === data.responses.length) {
      setRoundOver(true);
    } else {
      setRoundOver(false);
    }
  }, [data]);
  if (data) {
    //console.log("data.responses", data.responses);
    return (
      <>
        <h3>Question: {data.name}</h3>
        <h4>Question State: {data.state}</h4>
        <ExistingQuestion data={data} roundOver={roundOver} />
      </>
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
    <div>
      <h1>{data.name}</h1>
      <h3>Room ID: {data.id}</h3>
      <h4>State: {data.state}</h4>
      <Question
        data={data.questions[data.round]}
        roomId={data.id}
        nUsers={data.users.length}
      />
      <Users
        data={data.users}
        responses={R.propOr([], "responses", data.questions[data.round])}
      />
    </div>
  );
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
  }, [createRoomResp]);

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
      <div className="flex flex-col justify-center items-center">
        <div className=" pb-5/6 rounded-lg">
          <img
            className="object-cover rounded-lg shadow-md"
            src="https://i.kinja-img.com/gawker-media/image/upload/s--vMJWT-nB--/c_scale,f_auto,fl_progressive,q_80,w_800/mdc4jnl2amnpmnajblxn.jpg"
          />
        </div>
        <div className="p-6 bg-white relative  -mt-10 rounded-lg shadow-lg z-0">
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
            questions: [
              {
                name: "The Terminal",
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
        <div className="form-container">
          <Main />
        </div>
      </Route>
      <Components />
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
