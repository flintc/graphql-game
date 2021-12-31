import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
export const client = axios.create({
  baseURL: process.env.TMDB_API_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getMovie = async (context) => {
  const resp = await axios.get(
    "/api/tmdb" + "/movie/" + context.params.movieId
  );
  return { ...resp.data };
};

export const searchMovies = async ({ queryKey }) => {
  const [, , queryParams] = queryKey;
  if ((queryParams?.query || "").trim().length === 0) {
    return undefined;
  }
  const resp = await axios.get("/api/tmdb" + "/search/multi", {
    params: { ...queryParams },
  });
  return { ...resp.data };
};

export const getGeneres = async () => {
  const resp = await axios.get("/api/tmdb" + "/genre/movie/list");
  return { ...resp.data };
};

export const getKeywords = async () => {
  const resp = await axios.get("/api/tmdb" + "/search/keyword", {
    params: {
      query: "kidnapping",
    },
  });
  return { ...resp.data };
};

export const getPopular = async () => {
  const resp = await axios.get("/api/tmdb" + "/movie/popular", {
    params: {
      language: "en",
    },
  });
  return { ...resp.data };
};

export const getTopRated = async () => {
  const resp = await axios.get("/api/tmdb" + "/movie/top_rated", {
    params: {
      language: "en",
    },
  });
  return { ...resp.data };
};

export const discoverMovies = async (params) => {
  const resp = await axios.get("/api/tmdb" + "/discover/movie", {
    params: {
      sort_by: "vote_count.desc",
      include_adult: false,
      with_original_language: "en",
      ...params,
    },
  });
  return { ...resp.data };
};
