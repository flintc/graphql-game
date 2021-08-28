import { useQuery } from "react-query";
import axios from "axios";

export const useMovieScore = (movieId) => {
  const scores = useQuery(
    ["movie", "scores", movieId],
    async () => {
      const resp = await axios.get("http://localhost:3000/api/getScores", {
        params: { title: data.title, imdbId: data.imdb_id },
      });
      return resp;
    },
    { enabled: data !== undefined }
  );
  return scores;
};
