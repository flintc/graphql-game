import Link from "next/link";
import { useUser } from "../user-context";
import Router from "next/router";

const CreateOrJoin = () => {
  return (
    <div className="space-x-2 dark-theme">
      <Link href={{ pathname: "/create" }}>
        <a className="px-4 py-2 border rounded-md bg-primary-1 border-primary-7 text-primary-12">
          Create
        </a>
      </Link>
      <Link href={{ pathname: "/join" }}>
        <a className="px-4 py-2 border rounded-md bg-primary-1 border-primary-7 text-primary-12">
          Join
        </a>
      </Link>
    </div>
  );
};

const IndexPage = () => {
  const user = useUser();
  if (!user) {
    return (
      <div>
        Welcome
        <div>Login to play!</div>
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
    );
  }
  return (
    <div className="px-4 space-y-6">
      <h1 className="mb-3 text-4xl">Welcome {user.name}</h1>
      <CreateOrJoin />
      <div className="space-y-4">
        <div className="space-y-2">
          <div>
            <h2 className="text-3xl">Known for Game</h2>
            <p className="text-gray-11">
              Guess the four movies and/or tv series that an actor/actress is
              known for according to IMDb.
            </p>
          </div>
          <Link href={{ pathname: "/movies" }}>
            <a className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
              Search actors/actresses
            </a>
          </Link>
        </div>
        <div className="space-y-2">
          <div>
            <h2 className="text-3xl">Rotten or Fresh</h2>
            <p className="text-gray-11">
              Guess the score of a movie or tv show according to Rotten
              Tomatoes. Choose to guess the critics score, audiance score, or
              the difference between the two!
            </p>
          </div>
          <Link href={{ pathname: "/movies" }}>
            <a className="block w-full px-4 py-2 text-center border rounded-md bg-primary-1 border-primary-7 text-primary-12">
              Search movies/tv shows
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
