

//const webpack = require("webpack")
const path = require("path");

const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	
	mode: "development",
	
	entry: "./dist/Public/index.js",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist/Public/"),
	},
	
	plugins: [
		new CopyPlugin({
			patterns: [
				//"Public/index.html"
				//{ from: "source", to: "dest" },
				//{ from: "./Public/index.html", to: "dist/Public/index.html" },
				{
					from: "./Public",
					globOptions: {
						ignore: ["**.ts", "**.tsx"]
					}
				}
			],
		}),
	],
	
};