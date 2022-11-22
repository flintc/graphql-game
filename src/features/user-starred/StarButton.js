import { StarIcon } from "@heroicons/react/outline";
import { StarIcon as StarIconFilled } from "@heroicons/react/solid";
import { useUserStarred } from "./useUserStarred";

const StarButton = ({ movie }) => {
  const { starredQuery, addStarMutation, removeStarMutation } =
    useUserStarred();
  if (starredQuery.status === "loading") {
    return null;
  }
  if (starredQuery.status === "error") {
    return null;
  }
  const canRemove = starredQuery.data?.includes(String(movie.id));
  return (
    <button
      className="absolute p-1 text-white bottom-5 right-3"
      aria-label={`${canRemove ? "Remove" : "Add"} ${movie.title} ${
        canRemove ? "from" : "to"
      } favorites`}
      onClick={async (e) => {
        e.preventDefault();
        if (canRemove) {
          removeStarMutation.mutate(String(movie.id));
        } else {
          addStarMutation.mutate(String(movie.id));
        }
      }}
    >
      {canRemove ? (
        <StarIconFilled className="w-8 h-8 text-yellow-9" />
      ) : (
        <StarIcon className="w-8 h-8 text-white" />
      )}
    </button>
  );
};

export default StarButton;
