import React, { useState, useEffect, useContext } from "react";
import ReactDOM from "react-dom";

import { ApolloProvider } from "react-apollo";
import {
  useQuery,
  useSubscription,
  useLazyQuery,
  useMutation,
  useApolloClient
} from "@apollo/react-hooks";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory
} from "react-router-dom";
import client from "./client";
import * as R from "ramda";
import * as docs from "./documents";
import * as L from "partial.lenses";
import "./styles.css";

const generateCode = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 4)
    .toUpperCase();

const Context = React.createContext();

const ProtectedRoute = ({ component: Comp, loggedIn, path, ...rest }) => {
  return (
    <Route
      path={path}
      {...rest}
      render={props => {
        return loggedIn ? <Comp {...props} /> : <Redirect to="/" />;
      }}
    />
  );
};

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
    <form onSubmit={e => handleSubmit(e, { name, code })}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
      />
      <button>submit</button>
    </form>
  );
};

const Users = ({ name }) => {
  const { data, subscribeToMore, loading } = useQuery(
    docs.USERS_IN_ROOM_QUERY,
    {
      variables: { roomName: name }
    }
  );
  useEffect(() => {
    if (!loading) {
      subscribeToMore({
        document: docs.USERS_IN_ROOM_SUBSCRIPTION,
        variables: { roomName: name },
        updateQuery: (prev, { subscriptionData: { data } }) => {
          if (!data) return prev;
          return L.set(["user"], data.user, prev);
        }
      });
    }
  }, [loading, name, subscribeToMore]);
  if (loading) {
    return "Loading...";
  }
  return (
    <ul>
      {data.user.map(user => {
        return <li key={user.id}>{user.name}</li>;
      })}
    </ul>
  );
};

const computeScore = (guess, answer) => {
  if (guess === answer) {
    return -5;
  }
  return Math.abs(answer - guess);
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
const Question = ({ id }) => {
  const { user } = useContext(Context);
  const [value, setValue] = useState(null);
  const responseSubscription = useSubscription(
    docs.RESPONSE_FOR_QUESTION_SUBSCRIPTION,
    {
      variables: {
        questionId: id,
        userId: user.id
      }
    }
  );
  const [submitResponse] = useMutation(docs.SUBMIT_RESPONSE_FOR_QUESTION);
  console.log("respSubsc", responseSubscription);
  if (responseSubscription.loading) {
    return "Loading...";
  }
  if (!responseSubscription.data.response.length) {
    return (
      <div>
        <h3>Question id: {id}</h3>
        <h3>User ID: {user.id}</h3>
        <span>{user.name}'s answer:</span>
        <form
          onSubmit={e => {
            e.preventDefault();
            submitResponse({
              variables: {
                userId: user.id,
                questionId: id,
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
  if (responseSubscription.data.response[0].question.answer) {
    return (
      <Result
        guess={responseSubscription.data.response[0].value}
        answer={responseSubscription.data.response[0].question.answer}
      />
    );
  }
  return (
    <div>
      <span>Current Answer: {responseSubscription.data.response[0].value}</span>
    </div>
  );
};

const Room = ({
  match: {
    params: { name }
  }
}) => {
  const resp = useQuery(docs.ROOM_QUERY, {
    variables: {
      name
    }
  });
  const data = resp.data && resp.data.room[0];
  useEffect(() => {
    if (resp.data) {
      resp.subscribeToMore({
        document: docs.SUBSCRIBE_TO_ROOM,
        variables: { roomId: data.id },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          return L.set(
            ["room", 0, "users"],
            subscriptionData.data.room_by_pk.users,
            prev
          );
        }
      });
    }
  }, [resp, data]);
  if (resp.loading) {
    return "Loading...";
  }
  return (
    <div>
      <h1>{data.name}</h1>
      <h3>Room ID: {data.id}</h3>
      {data.questions.length && <h3>{data.questions[0].name}</h3>}
      {data.questions.length && <Question id={data.questions[0].id} />}
      <Users name={name} />
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
      <div>
        <button onClick={() => setState("create")}>create</button>
        <button onClick={() => setState("join")}>join</button>
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
