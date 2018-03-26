require("dotenv").config();

const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const merge = require("webpack-merge")

const common = require("../../../build/webpack.config")

const { SERVER_URL, CLIENT_PORT } = process.env

console.log(SERVER_URL)

module.exports = merge(common, {
  devtool: "sourcemap",
  entry: "./src/index",
  output: {
    path: path.resolve("dist"),
    filename: "index.js",
  },
  module: {
    rules: [
      {
        test: /\.worker.js$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "worker-loader",
            options: {
              name: "[hash].worker.js",
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              minimize: true,
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]",
              camelCase: true,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve("./dist/vendor/react.json")),
    }),
    new webpack.DllReferencePlugin({
      manifest: require(path.resolve("./dist/vendor/three.json")),
    }),
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    hot: true,
    stats: "minimal",
    publicPath: "/",
    contentBase: "dist",
    port: Number(CLIENT_PORT),
    proxy: {
      "/server/*": {
        target: SERVER_URL,
        ws: true,
      },
    },
  },
})
