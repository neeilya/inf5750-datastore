var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "build/assets/js/app.js"
    },
    plugins: [
        new CleanWebpackPlugin(['build']),
        new CopyWebpackPlugin([
            { from: './index.html', to: './build/' },
            { from: './assets', to: './build/assets'}
        ])
    ],
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    }
};