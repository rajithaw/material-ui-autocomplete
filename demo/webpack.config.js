const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'public';

module.exports = {
    entry: {
        bundle: ['@babel/polyfill', './src/index.js']
    },
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        contentBase: path.join(__dirname, outputDirectory),
        port: 3000,
        inline: true,
        compress: true
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: false
        }),
        new HtmlWebpackPlugin({
            template: './static/index.html',
            chunks: ['bundle']
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    }
};
