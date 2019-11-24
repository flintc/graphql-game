import React, { useContext } from "react";
import { ApolloProvider } from "react-apollo";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { StateContext, StateProvider } from "./app-state";
import client from "./client";
import ComponentsWithMocks from "./components-with-mocks";
import HomePage from "./pages/HomePage";
import RoomCreatePage from "./pages/RoomCreatePage";
import RoomJoinPage from "./pages/RoomJoinPage";
import RoomPage from "./pages/RoomPage";
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
      <ComponentsWithMocks />
      <Route path="/join" component={RoomJoinPage} />
      <Route path="/create" component={RoomCreatePage} />
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
