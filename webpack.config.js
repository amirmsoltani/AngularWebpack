const path = require('path');
const os = require('os');
const htmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = path.resolve(os.platform() === 'linux' ? '/var/www/html' : 'c:/xampp/htdocs/', process.env.PROGECT_NAME);

module.exports = {
    entry: "./app/Pages/Search/index.js",
    output: {
        filename: 'bundle.js',
        path: buildPath,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.html$/,
                loader:'html-loader',
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "Templates/htl_d_search.php",
            template: "app/Pages/Search/search.php"
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    },
    // externals: [/^@angular/]
};