module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: {
                path: "./.storybook/"
              }
            }
          }
        ]
      }
    ]
  }
};
