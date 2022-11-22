import Link from "next/link";
import { GENRE_LUT } from "../../shared/constants";
import { useGenres } from "./useGenres";

export const GenrePill = (genre) => {
  const genresQuery = useGenres();
  return (
    <Link
      passHref
      href={{
        pathname: "/movies/browse",
        query: { with_genres: `${genre.id}` },
      }}
    >
      <a
        className="px-2 py-1 text-xs border rounded-full shadow-md whitespace-nowrap"
        style={{
          borderColor: `var(--${GENRE_LUT[genre.id]}7)`,
          backgroundColor: `var(--${GENRE_LUT[genre.id]}3)`,
          color: `var(--${GENRE_LUT[genre.id]}12)`,
        }}
      >
        {genresQuery?.data?.[genre.id]}
      </a>
    </Link>
  );
};
