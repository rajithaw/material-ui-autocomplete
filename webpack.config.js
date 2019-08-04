const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const outputDirectory = 'dist';

module.exports = {
    entry: {
        index: ['@babel/polyfill', './src/index.js']
    },
    output: {
        path: path.join(__dirname, outputDirectory),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                include: [/src/],
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    emitWarning: false
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: false
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx']
    },
    externals: {
        'react': 'commonjs react' 
    }
};
