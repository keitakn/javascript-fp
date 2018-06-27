module.exports = {
  mode: "development",
  entry: {
    "public/js/chapter1": "./src/chapter1/main.ts",
    "public/js/chapter2": "./src/chapter2/main.ts"
  },
  output: {
    path: `${__dirname}/dist`,
    filename: "[name].bundle.js"
  },
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
