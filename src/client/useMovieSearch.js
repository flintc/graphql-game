import { searchMovies } from "./queryClient";
import { useQueryParams } from "../hooks";

export const useMovieSearch = () => {
  const queryParams = useQueryParams();
  const inputRef = React.useRef();
  const [params, setParams] = useState(queryParams);

  const throttledSetParams = React.useMemo(
    () =>
      _.debounce(
        (val) => {
          setParams(val);
        },
        800,
        { leading: false }
      ),
    []
  );
  const router = useRouter();
  const { data } = useQuery(["search", "movies", params], searchMovies, {
    staleTime: 100 * 60 * 1000,
    keepPreviousData: true,
    // initialData: props,
    // enabled: queryP
  });
  console.log("movie data", data);
  const onInputChange = React.useCallback(
    (e, value, ...rest) => {
      const query = value.length === 0 ? undefined : { query: value };
      router.push("/movies2?query=" + value, undefined, { scroll: false });
      throttledSetParams((x) => ({ ...x, ...(query || {}) }));
    },
    [router, throttledSetParams]
  );
  return {
    inputProps: { ref: inputRef, onChange: onInputChange },
  };
};
