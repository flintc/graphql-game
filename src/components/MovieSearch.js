import React, { useEffect, useReducer } from "react";
import MovieSearchInput from "./MovieSearchInput";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH": {
      return { ...state, value: "loading", selection: action.payload };
    }
    case "FAILURE_NOT_FOUND": {
      return {
        ...state,
        value: "failure",
        message: "Score not found. Please select a different movie."
      };
    }
    case "FAILURE_ERROR": {
      return {
        ...state,
        value: "failure",
        message: "Something went wrong. Please try again."
      };
    }
    case "RETRY": {
      return { value: "idle", response: null, selection: null, error: null };
    }
    case "SUCCESS": {
      return { ...state, value: "success", response: action.payload };
    }
  }
};

const MovieSearch = ({ onSelection }) => {
  const [current, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    if (current.value === "loading") {
      fetch(searchUrl(current.selection))
        .then(async resp => {
          const json = await resp.json();
          if (json.reception.score.rottenTomatoes) {
            dispatch({ type: "SUCCESS", payload: json });
          } else {
            dispatch({ type: "FAILURE_NOT_FOUND" });
          }
        })
        .catch(err => {
          console.error("error!", err);
          dispatch({ type: "FAILURE_ERROR" });
        });
    } else if (current.value === "success") {
      onSelection(current.response);
    }
  }, [current]);
  if (current.value == "failure") {
    return (
      <div>
        <h3>{current.message}</h3>
        <button className="btn" onClick={() => dispatch({ type: "RETRY" })}>
          try again
        </button>
      </div>
    );
  }
  return (
    <MovieSearchInput
      state={current.value}
      onSelect={title => dispatch({ type: "FETCH", payload: title })}
    />
  );
};

export default MovieSearch;
