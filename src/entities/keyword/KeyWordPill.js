import Link from "next/link";

export const KeyWordPill = (keyword) => {
  return (
    <Link
      href={{
        pathname: "/movies/browse",
        query: { with_keywords: `${keyword.id}` },
      }}
    >
      <a className="px-1.5 py-0.5 rounded-lg bg-gray-3">{keyword.name}</a>
    </Link>
  );
};
