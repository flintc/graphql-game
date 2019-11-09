import {
  useLazyQuery,
  useMutation,
  useSubscription
} from "@apollo/react-hooks";
import * as L from "partial.lenses";
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
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Room Code"
      />
      <button>submit</button>
    </form>
  );
};

const CreateForm = ({ handleSubmit }) => {
  const [name, setName] = useState(null);
  const code = generateCode();
  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={e => handleSubmit(e, { name, code })}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            htmlFor="name-input"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            NAME
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name"
          />
        </div>

        <button className="btn">submit</button>
      </form>
    </div>
  );
};

const Users = ({ data }) => {
  return (
    <ul>
      {data.map(user => {
        return <li key={user.id}>{user.name}</li>;
      })}
    </ul>
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
          <button>submit</button>
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
      <button>end round</button>
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
    console.log("data.responses", data.responses);
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
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <button>submit</button>
      </form>
    </div>
  );
};

const Room = ({
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
  const data = resp.data.room[0];
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
      <Users data={data.users} />
    </div>
  );
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
      <div className="flex justify-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setState("create")}
        >
          create
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 m-2 rounded focus:outline-none focus:shadow-outline"
          onClick={() => setState("join")}
        >
          join
        </button>
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

const Routes = () => {
  const { user } = useContext(Context);
  return (
    <>
      <Route path="/" exact component={Main} />
      <ProtectedRoute
        path="/game/:name"
        component={Room}
        loggedIn={user ? true : false}
      />
    </>
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
