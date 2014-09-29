var angularPlugin = require('angular-webpack-plugin');
var SplitByNamePlugin = require('split-by-name-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: {
      browser: "./src/browser/browser.js",
      native: './src/native/native.js'
    },
    output: {
        filename: "/[name].bundle.js",
        chunkFilename: "[name].bundle.js"

    },
    resolve: {
        alias: {
            ngRoute$: 'angular-route'
        },
        root: [
            process.cwd(),
            path.resolve('src', 'common', 'components'),
            path.resolve('src', 'common', 'directives'),
            path.resolve('src', 'common', 'services'),
            path.resolve('src', 'browser'),
            path.resolve('src', 'native'),
            path.resolve('bower_components')
        ]
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: "style-loader!css-loader!sass-loader?outputStyle=expanded" },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.html?/, loader: 'html-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' } // inline base64 URLs for <=8k images, direct URLs for the rest
        ]
    },
    plugins: [
        new angularPlugin(),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ),
/*        new SplitByNamePlugin({
            buckets: [{
                name: 'angular',
                regex: /(?:angular$|ngRoute$)/
            }, {
                name: 'jquery',
                regex: /(?:jquery$)/
            }]
        }),*/
        new webpack.optimize.CommonsChunkPlugin('common.bundle.js')
    ]

};