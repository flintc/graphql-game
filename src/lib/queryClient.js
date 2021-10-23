import axios from "axios";

const API_KEY = "4f7bcb6bc0a198a793dca6e48393e5f7";

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getMovie = async (context) => {
  const resp = await client.get("/movie/" + context.params.movieId);
  return { ...resp.data };
};

export const searchMovies = async ({ queryKey }) => {
  const [, , queryParams] = queryKey;
  if ((queryParams?.query || "").trim().length === 0) {
    return undefined;
  }
  const resp = await client.get("/search/multi", {
    params: { ...queryParams },
  });
  return { ...resp.data };
};

export const getGeneres = async () => {
  const resp = await client.get("/genre/movie/list");
  return { ...resp.data };
};

export const getKeywords = async () => {
  const resp = await client.get("/search/keyword", {
    params: {
      query: "kidnapping",
    },
  });
  return { ...resp.data };
};

export const getPopular = async () => {
  const resp = await client.get("/movie/popular", {
    params: {
      language: "en",
    },
  });
  return { ...resp.data };
};

export const getTopRated = async () => {
  const resp = await client.get("/movie/top_rated", {
    params: {
      language: "en",
    },
  });
  return { ...resp.data };
};

export const discoverMovies = async (params) => {
  const resp = await client.get("/discover/movie", {
    params: {
      sort_by: "vote_count.desc",
      include_adult: false,
      with_original_language: "en",
      ...params,
    },
  });
  return { ...resp.data };
};
