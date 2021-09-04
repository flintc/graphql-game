import React, { useState, useEffect } from "react";
import { discoverMovies, getGeneres, getKeywords } from "./queryClient";
import { useQueryParams } from "./useQueryParams";
import _ from "lodash";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const useMovieBrowse = () => {
  const queryParams = useQueryParams();
  const router = useRouter();
  const inputRef = React.useRef();

  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60,
  });

  const keywords = useQuery(["keyword", "search"], getKeywords, {
    staleTime: 1000 * 60 * 60,
  });

  const { data } = useQuery(
    ["browse", "movies", { without_genres: queryParams?.without_genres }],
    discoverMovies,
    {
      staleTime: 1000 * 60 * 1000,
      // keepPreviousData: true,
      // placeholderData: initialData,
      // enabled: queryP
    }
  );

  return {
    data,
    toggles: genres.data
      ? genres.data.genres.map((genre) => {
          return {
            defaultChecked: true,
            label: genre.name,
            value: genre.id,
            onChange: (e) => {
              const currentGenres = new Set(
                (router.query.without_genres || "").split(",")
              );
              currentGenres.delete("");
              if (!e.target.checked) {
                currentGenres.add(String(e.target.value));
              } else {
                currentGenres.delete(String(e.target.value));
              }
              router.push({
                pathname: "/movies",
                query: {
                  without_genres: Array.from(currentGenres).join(","),
                },
              });
            },
          };
        })
      : [],
  };
};
