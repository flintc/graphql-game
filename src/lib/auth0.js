import { initAuth0 } from "@auth0/nextjs-auth0";
import config from "./auth0-config";

export default initAuth0({
  baseURL: process.env.DOMAIN,
  issuerBaseURL: "https://" + config.AUTH0_DOMAIN,
  secret: config.AUTH0_SECRET,
  clientSecret: config.AUTH0_CLIENT_SECRET,
  routes: {
    callback: "/api/callback",
  },
});
