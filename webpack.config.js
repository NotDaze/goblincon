const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = [
  {
    // Public
    mode: "development",

    entry: "./Public/index.tsx",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "dist/Public/"),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },

    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "./Public",
            globOptions: {
              ignore: ["**.ts", "**.tsx"],
            },
          },
        ],
      }),
    ],
  },
  {
    // Public
    mode: "development",
    target: "node",
    entry: "./app.ts",
    output: {
      filename: "app.js",
      path: path.resolve(__dirname, "dist/"),
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    externals: ["bufferutil", "utf-8-validate"],
  },
];
