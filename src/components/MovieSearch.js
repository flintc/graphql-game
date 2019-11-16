import { useMutation } from "@apollo/react-hooks";
import React from "react";
import * as docs from "../documents";
import MovieSearchInput from "./MovieSearchInput";

const searchUrl = title =>
  `https://kha9mwfrdb.execute-api.us-east-1.amazonaws.com/dev/search/${title}`;

const MovieSearch = ({ roomId }) => {
  const [submitQuestion] = useMutation(docs.SUBMIT_QUESTION_MUTATION);
  const handleSelected = title => {
    fetch(searchUrl(title))
      .then(async resp => {
        const json = await resp.json();
        submitQuestion({
          variables: {
            roomId: roomId,
            description: json.description,
            imageUrl: json.poster,
            name: json.title,
            answer: json.reception
          }
        });
      })
      .catch(err => {
        console.error("error!", err);
      });
  };
  return <MovieSearchInput onSelect={handleSelected} />;
};

export default MovieSearch;
