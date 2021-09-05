import _ from "lodash";

export const GENRE_LUT = _.zipObject(
  [
    28, 12, 16, 35, 80, 99, 18, 10751, 14, 36, 27, 10402, 9648, 10749, 878,
    10770, 53, 10752, 37,
  ].sort(),
  [
    "tomato",
    "red",
    "crimson",
    "pink",
    "plum",
    "purple",
    "violet",
    "indigo",
    "blue",
    "cyan",
    "teal",
    "green",
    "grass",
    "orange",
    "brown",
    "sky",
    "mint",
    "lime",
    "yellow",
  ]
);
