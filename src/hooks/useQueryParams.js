import { useRouter } from "next/dist/client/router";

const parseQueryParams = (asPath) => {
  const url = new URL(asPath, "http://dummy.com");
  return _.fromPairs(Array.from(url.searchParams.entries()));
};
export const useQueryParams = () => {
  const { asPath, ...rest } = useRouter();
  return parseQueryParams(asPath);
};
