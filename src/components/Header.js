import {
  MoonIcon as MoonIconOutline,
  PlayIcon as PlayIconOutline,
  SearchIcon as SearchIconOutline,
  StarIcon as StarIconOutline,
  SunIcon as SunIconOutline,
  UserIcon as UserIconOutline,
} from "@heroicons/react/outline";
import {
  MoonIcon,
  PlayIcon,
  SearchIcon,
  StarIcon,
  SunIcon,
  UserIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useUserStarred } from "../lib/useUserStarred";

const Header = () => {
  const router = useRouter();
  const [isDarkTheme] = useState(
    document.documentElement.classList.contains("dark-theme")
  );
  const {
    starredQuery: { data: starred },
  } = useUserStarred();
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
          {starred?.length ? (
            <div className="absolute flex items-center justify-center p-[0.075em] text-xs rounded-full bottom-[50%] left-[70%] bg-secondary-9 text-center text-white font-extrabold">
              <span className="w-4 h-4">{starred.length}</span>
            </div>
          ) : null}
        </a>
      </Link>
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
