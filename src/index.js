import React, { useContext } from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { StateContext, StateProvider } from "./app-state";
import client from "./client";
import HomePage from "./pages/HomePage";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomJoinPage from "./pages/RoomJoinPage";
import RoomPage from "./pages/RoomPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./ProtectedRoute";
import "./styles/index.css";

import "./styles/custom.css";

const Routes = () => {
  const { user } = useContext(StateContext);
  return (
    <div className="app">
      <Route path="/" exact>
        <HomePage />
      </Route>
      <Route path="/join" component={RoomJoinPage} />
      <Route path="/create" component={RoomCreatePage} />
      <Route path="/login/:id" component={UserPage} />
      <ProtectedRoute
        path="/room/:name"
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
