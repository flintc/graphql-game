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
  return { props: { ...resp.data } };
};

export const searchMovies = async ({ queryKey }) => {
  const [, , queryParams] = queryKey;
  if ((queryParams?.query || "").trim().length === 0) {
    return undefined;
  }
  const resp = await client.get("/search/movie", {
    params: { ...queryParams },
    // params: {
    //   with_genres: 35,
    //   sort_by: "revenue.desc",
    //   without_genres: "16,28,12",
    // },
  });
  return { ...resp.data };
};

export const discoverMovies = async () => {
  const resp = await client.get("/discover/movie", {
    params: {
      // with_genres: 35,
      sort_by: "popularity.desc",
      include_adult: false,
      with_original_language: "en",
      // without_genres: "16,28,12",
    },
  });
  // console.log("discover?", resp.data);
  return { ...resp.data };
};
