const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");

//this becomes server of products micro frontend
module.exports = {
  mode: "development",
  devServer: {
    port: 8081
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "products",
      filename: "remoteEntry.js",
      exposes: {
        "./ProductsIndex": "./src/index"
      },
      shared: ["faker"]
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    })
  ]
};