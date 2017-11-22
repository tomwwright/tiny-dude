var path = require("path");
var webpack = require("webpack");
var glob = require("glob");

module.exports = {
  entry: {
    app: ["babel-polyfill", "./build/es5/app.js"],
    vendor: ["react", "react-dom", "mobx", "mobx-react", "rebass"]
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    extensions: [".webpack.js", ".web.js", ".js"],

    modules: ["node_modules", path.resolve(__dirname, "build/es5")],
  },

  module: {
    rules: [
      { test: /\.js$/, loader: "source-map-loader" }, // re-process existing source maps
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ["game", "vendor"],
      filename: "[name].bundle.js"
    })
  ],

  output: {
    path: __dirname + "/build/bundle",
    filename: "[name].bundle.js"
  }
};
