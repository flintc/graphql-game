import React, { useEffect, useReducer } from "react";
import MovieSearchInput from "./MovieSearchInput";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const reducer = (state, action) => {
  switch (action.type) {
    case "selected": {
      return { ...state, selection: action.payload };
    }
    case "noScore": {
      return {
        ...state,
        error: "Score not found. Please select a different movie."
      };
    }
    case "searchError": {
      return { ...state, error: "Something went wrong. Please try again." };
    }
    case "clearError": {
      return { response: null, selection: null, error: null };
    }
    case "searchSuccess": {
      return { ...state, response: action.payload };
    }
  }
};

const MovieSearch = ({ onSelection }) => {
  const [state, dispatch] = useReducer(reducer, {});
  useEffect(() => {
    if (state.selection && !state.response && !state.error) {
      fetch(searchUrl(state.selection))
        .then(async resp => {
          const json = await resp.json();
          if (json.reception.score.rottenTomatoes) {
            dispatch({ type: "searchSuccess", payload: json });
          } else {
            dispatch({ type: "noScore" });
          }
        })
        .catch(err => {
          console.error("error!", err);
          dispatch({ type: "searchError" });
        });
    } else if (state.response) {
      onSelection(state.response);
    }
  }, [state]);
  if (state.error) {
    return (
      <div>
        <h3>{state.error}</h3>
        <button
          className="btn"
          onClick={() => dispatch({ type: "clearError" })}
        >
          try again
        </button>
      </div>
    );
  }
  return (
    <MovieSearchInput
      onSelect={title => dispatch({ type: "selected", payload: title })}
    />
  );
};

export default MovieSearch;
