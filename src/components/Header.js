import {
  PlayIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../user-context";

const Header = () => {
  const router = useRouter();
  const user = useUser();
  // const [isDarkTheme] = useState(
  //   document?.documentElement?.classList?.contains("dark-theme")
  // );

  // const {
  //   starredQuery: { data: starred },
  // } = useUserStarred();

  // const onClick = () => {
  //   if (isDarkTheme) {
  //     window.localStorage.setItem("theme", "light");
  //     document.documentElement.classList.remove("dark-theme");
  //     document.documentElement.classList.remove("dark");

  //     setIsDarkTheme(false);
  //   } else {
  //     window.localStorage.setItem("theme", "dark");
  //     document.documentElement.classList.add("dark-theme");
  //     document.documentElement.classList.add("dark");

  //     setIsDarkTheme(true);
  //   }
  // };

  return (
    // <FixedBottom>
    <div className="flex justify-around w-full px-2 py-4 border-b text-gray-11 dark:text-white bg-gray-1 app-bar border-gray-6">
      <Link href="/">
        <a
          className={router.pathname === "/" ? "text-primary-11" : ""}
          aria-label="Play"
        >
          <PlayIcon className="w-7 h-7" />
        </a>
      </Link>
      <Link href="/movies" scroll={true}>
        <a
          className={
            router.pathname.startsWith("/movies") ? "text-primary-11" : ""
          }
          aria-label="Search"
        >
          <SearchIcon className="w-7 h-7" />
        </a>
      </Link>
      {user && (
        <Link href="/starred" scroll={true}>
          <a
            className={`relative ${
              router.pathname.startsWith("/starred")
                ? "fill-current stroke-current text-primary-11"
                : ""
            }`}
            aria-label="Starred"
          >
            <StarIcon className="w-7 h-7" />
          </a>
        </Link>
      )}
      <Link href="/summary" scroll={true}>
        <a
          className={
            router.pathname.startsWith("/summary") ? "text-primary-11" : ""
          }
          aria-label="Profile"
        >
          <UserIcon className="w-7 h-7" />
        </a>
      </Link>
      {/* <a className="" aria-label="Logout">
        <LogoutIcon className="w-7 h-7" />
      </a> */}
      {/* <button
        className=""
        onClick={onClick}
        aria-label={isDarkTheme ? "Toggle light theme" : "Toggle dark theme"}
      >
        {isDarkTheme ? (
          <SunIcon className="w-7 h-7" />
        ) : (
          <MoonIcon className="w-7 h-7" />
        )}
      </button> */}
    </div>
  );
};

export default Header;
