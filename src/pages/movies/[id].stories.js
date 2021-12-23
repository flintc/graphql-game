import { QueryClient, QueryClientProvider } from "react-query";
// import { SUBSCRIBE_TO_USER } from "../../user-subscription";
import MovieDetailsPage, { WatchProviders } from "./[id].page";

export default {
  title: "Movies/[id]",
};

const queryClient = new QueryClient();

export const WatchProvidersComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <WatchProviders movieId={27205} />
    </QueryClientProvider>
  );
};

export const Foo = () => {
  return <div>Foo</div>;
};

export const Page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MovieDetailsPage />
    </QueryClientProvider>
  );
};

Page.story = {
  parameters: {
    nextRouter: {
      path: "/movies/[id]",
      asPath: "/movies/27205",
      query: {
        id: "27205",
      },
    },
  },
};
