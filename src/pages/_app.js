// import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
import Header from "../components/Header";
import { withApollo } from "../lib/withApolloClient";
import { UserProvider } from "../user-context";
import { QueryClient, QueryClientProvider } from "react-query";
import React, { useRef, useEffect, memo } from "react";
import { useRouter } from "next/router";
import {
  UserSubcriptionProvider,
  useUserSubscription,
} from "../user-subscription";
import Head from "next/head";
import { AnimateSharedLayout } from "framer-motion";

const ROUTES_TO_RETAIN = ["/movies"];

const ScrollPosition = ({ Component, pageProps }) => {
  const router = useRouter();
  const retainedComponents = useRef({});

  const isRetainableRoute = ROUTES_TO_RETAIN.includes(router.pathname);
  // Add Component to retainedComponents if we haven't got it already
  if (isRetainableRoute && !retainedComponents.current[router.pathname]) {
    const MemoComponent = memo(Component);
    retainedComponents.current[router.pathname] = {
      component: <MemoComponent {...pageProps} />,
      scrollPos: 0,
    };
  }

  // Save the scroll position of current page before leaving
  const handleRouteChangeStart = (url) => {
    if (isRetainableRoute) {
      retainedComponents.current[router.pathname].scrollPos = window.scrollY;
    }
  };

  // Save scroll position - requires an up-to-date router.asPath
  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
    };
  }, [router.pathname]);

  // Scroll to the saved position when we load a retained component
  useEffect(() => {
    if (isRetainableRoute && router.query.search !== undefined) {
      window.scrollTo(0, retainedComponents.current[router.pathname].scrollPos);
    }
  }, [Component, pageProps, router.pathname]);

  return (
    <div>
      <div style={{ display: isRetainableRoute ? "block" : "none" }}>
        {Object.entries(retainedComponents.current).map(([path, c]) => (
          <div
            key={path}
            style={{ display: router.pathname === path ? "block" : "none" }}
          >
            {c.component}
          </div>
        ))}
      </div>
      {!isRetainableRoute && <Component {...pageProps} />}
    </div>
  );
};

const queryClient = new QueryClient();

const CurrentState = () => {
  const user = useUserSubscription();
  return (
    <div>
      <div>State: {user.room?.state}</div>
      <div>Round: {user.room?.round + 1}</div>
    </div>
  );
};
// This default export is required in a new `pages/_app.js` file.
function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <UserSubcriptionProvider>
          <Head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, shrink-to-fit=no"
            />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark-theme')
                document.documentElement.classList.add('dark')

              } else {
                document.documentElement.classList.remove('dark-theme')
                document.documentElement.classList.remove('dark')

              }

              // Whenever the user explicitly chooses light mode
              localStorage.theme = 'light'

              // Whenever the user explicitly chooses dark mode
              localStorage.theme = 'dark'

              // Whenever the user explicitly chooses to respect the OS preference
              localStorage.removeItem('theme')
              `,
              }}
            />
          </Head>
          <AnimateSharedLayout type="crossfade">
            <div>
              <Header />

              {/* <Header /> */}
              {/* <CurrentState /> */}

              <ScrollPosition Component={Component} pageProps={pageProps} />
              {/* <Component {...pageProps} /> */}
            </div>
          </AnimateSharedLayout>
        </UserSubcriptionProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default withApollo({ ssr: true })(MyApp);
