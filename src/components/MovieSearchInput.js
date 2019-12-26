import * as L from "partial.lenses";
import * as R from "ramda";
import React, { useState } from "react";
import movies from "../movies_old";

const MovieSearchInput = ({ onSelect = console.log }) => {
  const [value, setValue] = useState();
  const results = R.sortWith(
    [
      R.ascend(x => (x.title.length === value.length ? 0 : 1)),
      R.descend(R.prop("year"))
    ],
    L.collect(
      [
        L.satisfying(
          R.where({
            title: x => x && value && R.toLower(x).includes(R.toLower(value))
          })
        )
      ],
      movies
    )
  );
  return (
    <div>
      <input
        placeholder="Search movie titles..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <div
        className={`absolute bg-gray-100 text-gray-600 rounded-lg shadow-xl h-64 overflow-y-scroll w-64 ${
          results.length === 0 ? "hidden" : "block"
        }`}
      >
        <ul>
          {results.slice(0, 15).map((result, ix) => {
            return (
              <li
                //onClick={() => onSelect(result.link.replace("/wiki/", ""))}
                onClick={() => onSelect(result.title)}
                key={ix}
                className="hover:bg-indigo-600 w-full hover:text-white px-2"
              >
                {result.title} ({result.year})
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MovieSearchInput;
