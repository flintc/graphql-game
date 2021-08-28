import { AnimateSharedLayout } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative flex flex-col h-full">
        {/* <div>
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/search">
            <a>Search</a>
          </Link>
        </div> */}
        {/* <ScrollArea className="flex flex-col"> */}
        <AnimateSharedLayout type="crossfade">
          <Component {...pageProps} />
        </AnimateSharedLayout>
        {/* </ScrollArea> */}
      </div>
    </QueryClientProvider>
  );
}

export default MyApp;
