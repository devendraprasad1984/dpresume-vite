const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './server/oneliners.js',
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.resolve('server-build'),
        filename: 'oneliners.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            }
        ]
    }
};