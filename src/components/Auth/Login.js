import Router from "next/router";

// import { Button } from "react-bootstrap";

const Login = () => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-heading">
          Welcome to the GraphQL tutorial app
        </div>
        <div className="overlay-message">Please login to continue</div>
        <div className="overlay-action">
          <button
            id="qsLoginBtn"
            variant="primary"
            className="btn-margin loginBtn"
            onClick={() => {
              Router.push("/api/login");
            }}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
