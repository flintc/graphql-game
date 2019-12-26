const proxy = require("http-proxy-middleware");
module.exports = function(app) {
  app.use(
    "/search",
    proxy({
      target: process.env.SEARCH_URL,
      changeOrigin: true
    })
  );
};
