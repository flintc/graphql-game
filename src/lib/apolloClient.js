// import {
//   createClient,
//   defaultExchanges,
//   subscriptionExchange,
//   useSubscription,
//   gql,
// } from "urql";
// import { createClient as createWSClient } from "graphql-ws";

// const wsClient = createWSClient({
//   url:
//     typeof window === undefined ? "" : process.env.NEXT_PUBLIC_GRAPHQL_WS_URL,
// });

// export const clientConfig = {
//   url: "/graphql",
//   exchanges: [
//     ...defaultExchanges,
//     subscriptionExchange({
//       forwardSubscription: (operation) => ({
//         subscribe: (sink) => ({
//           unsubscribe: wsClient.subscribe(operation, sink),
//         }),
//       }),
//     }),
//   ],
// };

// const client = createClient(clientConfig);

// const SUBSCRIBE_TO_USER = gql`
//   subscription User {
//     user_by_pk(id: "02226764-e865-417a-aaba-343bacae6a27") {
//       id
//       name
//       room {
//         state
//         questions {
//           name
//           id
//           responses {
//             value
//             owner {
//               id
//               name
//             }
//           }
//         }
//       }
//       responses {
//         value
//       }
//     }
//   }
// `;

// const handleSubscription = (messages = [], response) => {
//   return [response.newMessages, ...messages];
// };

// const useUserSubscription = () => {
//   // const [res] = useSubscription(SUBSCRIBE_TO_USER, handleSubscription);
//   console.log("res");
//   // return [res];
//   return [1, 2, 3];
// };

// export default SubscriptionProvider = ({ children }) => {
//   const [out] = useUserSubscription();
//   console.log("SubscriptionProvider", SubscriptionProvider);
//   return <div>hi{children}</div>;
// };

// // subscription
// export function subscribeToUser() {
//   const onNext = () => {
//     /* handle incoming values */
//   };

//   let unsubscribe = () => {
//     /* complete the subscription */
//   };

//   return new Promise((resolve, reject) => {
//     unsubscribe = wsClient.subscribe(
//       {
//         query: "subscription { greetings }",
//       },
//       {
//         next: onNext,
//         error: reject,
//         complete: resolve,
//       }
//     );
//   });
// }

import fetch from "isomorphic-unfetch";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import gql from "graphql-tag";

const createHttpLink = (headers) => {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_HTTP_URL,
    credentials: "include",
    headers, // auth token is fetched on the server side
    fetch,
  });
  return httpLink;
};

const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient(process.env.NEXT_PUBLIC_GRAPHQL_WS_URL, {
      lazy: true,
      reconnect: true,
    })
  );
};

export default function createApolloClient(initialState, headers) {
  const ssrMode = typeof window === "undefined";
  let link;
  if (ssrMode) {
    link = createHttpLink(headers); // executed on server
  } else {
    link = createWSLink(); // executed on client
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  });
}
