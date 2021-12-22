import React, { useState, useEffect } from "react";
import { searchMovies } from "./queryClient";
import { useQueryParams } from "./useQueryParams";
import _ from "lodash";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

export const useMovieSearch = () => {
  const queryParams = useQueryParams();
  const router = useRouter();
  const inputRef = React.useRef();
  const [params, setParams] = useState({ query: queryParams.search });

  const throttledSetParams = React.useMemo(
    () =>
      _.debounce(
        (val) => {
          setParams(val);
        },
        300,
        { leading: false }
      ),
    []
  );

  useEffect(() => {
    if (router.pathname === "/movies") {
      if (queryParams.search !== params.query) {
        const value = queryParams.search;
        const query = (value || "").length === 0 ? undefined : { query: value };
        throttledSetParams((x) => ({ ...x, query: queryParams.search }));
        if (queryParams.search === undefined) {
          inputRef.current.value = "";
        }
      }
    } else {
      if (queryParams.search !== params.query) {
        const value = queryParams.search;
        const query = (value || "").length === 0 ? undefined : { query: value };
        throttledSetParams((x) => ({ ...x, query: queryParams.search }));
        if (queryParams.search === undefined) {
          inputRef.current.value = "";
        }
      }
    }
  }, [queryParams, throttledSetParams, router.pathname, params.query]);

  const { data } = useQuery(["search", "movies", params], searchMovies, {
    staleTime: 10000 * 60 * 1000,
    keepPreviousData: true,
    // placeholderData: initialData,
    // enabled: queryP
  });
  const onInputChange = React.useCallback(
    (e, libValue) => {
      const value = libValue || e.target.value;
      router.replace(
        // router.pathname + "?search=" + value,
        {
          pathname: router.pathname,
          query: { ...router.query, search: value },
          scroll: false,
        },
        undefined,
        {
          scroll: false,
          shallow: true,
        }
      );
    },
    [router]
  );
  const onCancel = React.useCallback(() => {
    inputRef.current.value = "";
    // setParams({});
    router.push(
      {
        pathname: router.pathname,
        query: { ..._.omit(router.query, ["search"]) },
      },
      undefined,
      { scroll: false }
    );
  }, [router]);

  const onFocus = React.useCallback(() => {
    if (_.isNil(params.query)) {
      router.push(
        { pathname: router.pathname, query: { ...router.query, search: "" } },
        undefined,
        {
          scroll: false,
          shallow: true,
        }
      );
      throttledSetParams((x) => ({ ...x, search: "" }));
    }
  }, [router, throttledSetParams, params.query]);

  return {
    data,
    inputProps: {
      defaultValue: params.query,
      ref: inputRef,
      onChange: onInputChange,
      onFocus,
    },
    onCancel,
  };
};
