import "../src/styles/App.css";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 12
import { UserProvider, UserContext } from "../src/user-context";
import {
  // SUBSCRIBE_TO_USER,
  // UserSubcriptionProvider,
  UserSubscriptionContext,
} from "../src/user-subscription";
// import { MockedProvider } from "@apollo/client/testing"; // Use for Apollo Version 3+

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    darkClass: "dark-theme",
    lightClass: "light-theme",
    classTarget: "html",
    stylePreview: true,
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  },
  // apolloClient: {
  //   MockedProvider,
  //   // any props you want to pass to MockedProvider on every story
  //   mocks: [
  //     {
  //       request: {
  //         // query: SUBSCRIBE_TO_USER,
  //       },
  //       result: {
  //         data: {
  //           user: {
  //             id: "abc",
  //             name: "foobar",
  //           },
  //         },
  //       },
  //     },
  //   ],
  // },
};

export const decorators = [
  (Story) => {
    return (
      <UserContext.Provider value={null}>
        <UserSubscriptionContext.Provider
          value={{
            id: "abc",
            name: "foobar",
          }}
        >
          <Story />
        </UserSubscriptionContext.Provider>
      </UserContext.Provider>
    );
  },
  // (Story) => {
  //   return (
  //     <UserProvider>
  //       <UserSubscriptionContext.Provider
  //         value={{
  //           id: "abc",
  //           name: "foobar",
  //         }}
  //       >
  //       <Story />
  //       </UserSubscriptionContext.Provider>
  //     </UserProvider>
  //   );
  // },
];
