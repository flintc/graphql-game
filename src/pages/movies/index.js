/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import {
  discoverMovies,
  searchMovies,
  getGeneres,
} from "../../lib/queryClient";
import { useMovieSearch } from "../../lib/useMovieSearch";
import _ from "lodash";
import { useQueryParams } from "../../lib/useQueryParams";
import { useMovieBrowse } from "../../lib/useMovieBrowse";
import { useQuery } from "react-query";
import { motion, AnimatePresence } from "framer-motion";
import ScrollArea from "../../components/ScrollArea";

// export const getServerSideProps = async (ctx) => {
//   if (_.isNil(ctx.query.search)) {
//     const resp = await discoverMovies(ctx.query);
//     return { props: resp };
//   }
//   const resp = await searchMovies({
//     queryKey: ["", "", { query: ctx.query.search }],
//   });
//   return { props: { ...ctx.query, ...(resp || { results: [] }) } };
// };

// function MoviesBrowse({ results = [] }) {
//   const { data, loading, error, toggles } = useMovieBrowse();
//   return (
//     <div>
//       <div>
//         {toggles.map((toggle) => {
//           return (
//             <span>
//               <input
//                 type="checkbox"
//                 value={toggle.value}
//                 defaultChecked={toggle.defaultChecked}
//                 onChange={toggle.onChange}
//               />
//               <label>{toggle.label}</label>
//             </span>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

const MovieLink = ({ movie }) => {
  return (
    <li key={`${movie.id}`}>
      <Link
        href={{ pathname: "/movies/[id]", query: { id: movie.id } }}
        scroll={false}
      >
        <a>
          {movie.title} (Film - {movie?.release_date?.split("-")[0]})
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const TvLink = ({ movie }) => {
  return (
    <li key={`${movie.id}`}>
      <Link
        href={{ pathname: "/tv/[id]", query: { id: movie.id } }}
        scroll={false}
      >
        <a>
          {movie.name} (TV Series - {movie?.first_air_date?.split("-")?.[0]})
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const PersonLink = ({ person }) => {
  return (
    <li key={`${person.id}`}>
      <Link
        href={{ pathname: "/people/[id]", query: { id: person.id } }}
        scroll={false}
      >
        <a>
          {person.name}
          <img
            style={{ width: "80px", height: "120px" }}
            src={`https://image.tmdb.org/t/p/original/${person.profile_path}`}
          />
        </a>
      </Link>
    </li>
  );
};

const filterResults = (result) => {
  if (result.media_type === "movie") {
    return result.vote_count > 100 && result.poster_path;
  } else if (result.media_type === "person") {
    return result.popularity > 0.99 && result.profile_path;
  } else if (result.media_type === "tv") {
    return result.popularity > 0.99 && result.poster_path;
  }
  return false;
};

function MoviesSearchResults({ results }) {
  return (
    <div>
      <ul>
        {results.filter(filterResults).map((result) => {
          return (
            <div key={result.id}>
              {["movie"].includes(result.media_type) ? (
                <MovieLink movie={result} />
              ) : ["tv"].includes(result.media_type) ? (
                <TvLink movie={result} />
              ) : (
                <PersonLink person={result} />
              )}
            </div>
          );
        })}
      </ul>
    </div>
  );
}

// function MoviesBrowseCategory() {
//   const { data } = useMovieBrowse();
//   return <div></div>;
// }

function MoviesBrowseCategories() {
  // getGeneres;
  const genres = useQuery("genres", getGeneres, {
    staleTime: 1000 * 60 * 60,
  });
  return (
    <div>
      <div>
        <div>Browse by Decade</div>
        <ScrollArea>
          <div className="flex gap-2 flex-nowrap">
            {[
              {
                title: "The 1960s",
                years: ["1960", "1969"],
                className: "from-teal-9 to-brown-9",
              },
              {
                title: "The 1970s",
                years: ["1970", "1979"],
                className: "from-grass-9 to-red-9",
              },
              {
                title: "The 1980s",
                years: ["1980", "1989"],
                className: "from-tomato-9 to-plum-9",
              },
              {
                title: "The 1990s",
                years: ["1990", "1999"],
                className: "from-crimson-9 to-violet-9",
              },
              {
                title: "The 2000s",
                years: ["2000", "2009"],
                className: "from-plum-9 to-blue-9",
              },
              {
                title: "The 2010s",
                years: ["2010", "2019"],
                className: "from-violet-9 to-teal-9",
              },
              {
                title: "The 2020s",
                years: ["2020", "2029"],
                className: "from-blue-9 to-grass-9",
              },
            ].map((decade) => {
              return (
                <Link
                  key={decade.title}
                  href={{
                    pathname: "/movies/browse",
                    query: {
                      with_release_type: 3, // 3 = release
                      "primary_release_date.gte": `${decade.years[0]}-01-01`,
                      "primary_release_date.lte": `${decade.years[1]}-12-31`,
                    },
                  }}
                >
                  <a
                    className={`my-6 w-32 h-32 text-white shadow-md rounded-lg flex justify-start p-2 items-end text-3xl  bg-gradient-to-br ${decade.className}`}
                  >
                    {decade.title}
                  </a>
                </Link>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <div>
        <div>Browse by Genre</div>
        {genres?.data?.genres.map((genre) => {
          return (
            <div
              key={genre.id}
              style={
                {
                  // height: "80px"
                }
              }
            >
              <Link
                href={{
                  // pathname: "/movies/category/[categoryId]",
                  // query: { categoryId: genre.id },
                  pathname: "/movies/browse",
                  query: { with_genres: `${genre.id}` },
                }}
              >
                <a>{genre.name}</a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MoviesPage({ search, results, ...rest }) {
  const queryParams = useQueryParams();
  const { data, inputProps, onCancel } = useMovieSearch({
    initialData: { results, ...rest },
  });

  return (
    <div className="px-2">
      <motion.div layoutId="foo" layout className="flex gap-2 px-1 flex-nowrap">
        <motion.input placeholder="Search The Movie Database" {...inputProps} />
        <AnimatePresence>
          {!_.isNil(queryParams.search) && (
            <motion.button
              className="text-gray-11 px-1 py-0.5"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              onClick={onCancel}
            >
              cancel
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
      {_.isNil(queryParams.search) ? (
        // <MoviesBrowse />
        <MoviesBrowseCategories />
      ) : (
        <MoviesSearchResults results={data?.results || []} />
      )}
    </div>
  );
}
