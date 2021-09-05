import Link from "next/link";
import { useRouter, withRouter } from "next/router";
import { useEffect, useState } from "react";
import LogoutBtn from "./Auth/Logout";
import {
  PlayIcon,
  SearchIcon,
  UserIcon,
  LogoutIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/outline";
import { FixedBottom } from "react-fixed-bottom";

const Header = () => {
  const router = useRouter();
  const [isDarkTheme, setIsDarkTheme] = useState(
    document.documentElement.classList.contains("dark-theme")
  );
  const [showAppBar, setShowAppBar] = useState(true);
  const onClick = () => {
    if (isDarkTheme) {
      window.localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark-theme");
      document.documentElement.classList.remove("dark");

      setIsDarkTheme(false);
    } else {
      window.localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.add("dark");

      setIsDarkTheme(true);
    }
  };
  // if (router.query?.search !== undefined) {
  //   return null;
  // }

  return (
    // <FixedBottom>
    <div className="flex justify-around w-full px-2 py-4 app-bar bg-primary-8 dark:bg-primary-3">
      <Link href="/">
        <a className="text-primary-12 dark:text-primary-11" aria-label="Play">
          <PlayIcon className="w-5 h-5" />
        </a>
      </Link>
      <Link href="/movies" scroll={true}>
        <a className="text-primary-12 dark:text-primary-11" aria-label="Search">
          <SearchIcon className="w-5 h-5" />
        </a>
      </Link>
      <Link href="/summary" scroll={true}>
        <a
          className="text-primary-12 dark:text-primary-11"
          aria-label="Profile"
        >
          <UserIcon className="w-5 h-5" />
        </a>
      </Link>
      <a className="text-primary-12 dark:text-primary-11" aria-label="Logout">
        <LogoutIcon className="w-5 h-5" />
      </a>
      <button
        className="text-primary-12 dark:text-primary-11"
        onClick={onClick}
        aria-label={isDarkTheme ? "Toggle light theme" : "Toggle dark theme"}
      >
        {isDarkTheme ? (
          <SunIcon className="w-5 h-5" />
        ) : (
          <MoonIcon className="w-5 h-5" />
        )}
      </button>
    </div>
    // </FixedBottom>
  );
};

export default Header;
