const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    "/parse",
    proxy({
      target: process.env.SEARCH_PROXY_TARGET,
      changeOrigin: true
    })
  );
};
