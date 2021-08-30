import { AnimateSharedLayout } from "framer-motion";
import { QueryClient, QueryClientProvider } from "react-query";
import dynamic from "next/dynamic";
// import {
//   useUserSubscription,
//   // clientConfig,
// } from "../client/subscriptionClient";
// import { withUrqlClient } from "next-urql";
import "../styles/globals.css";
import { withApollo } from "../client/withApolloClient";

// const SubscriptionProvider = dynamic(
//   () => import("../client/subscriptionClient"),
//   { ssr: false }
// );
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  // const [out] = useUserSubscription();
  // console.log("useUserSubscription", useUserSubscription, out);
  console.log("here");
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

export default withApollo({ ssr: true })(MyApp);
