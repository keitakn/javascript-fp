module.exports = {
  mode: "development",
  entry: "./src/chapter1/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /^node_modules/,
        loader: "ts-loader",
        options: {
          configFile: "./config/frontend/tsconfig.json"
        }
      }
    ]
  },
  resolve: {
    extensions: [
      ".ts",
      ".tsx"
    ]
  }
};
