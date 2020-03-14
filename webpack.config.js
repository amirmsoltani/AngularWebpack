const path = require('path');
const os = require('os');
const htmlWebpackPlugin = require('html-webpack-plugin');
const buildPath = path.resolve(os.platform() === 'linux'?'/var/www/html':'c:/xampp/htdocs/',process.env.PROGECT_NAME);

module.exports = {
    entry: "./app/Pages/Search/index.js",
    output: {
        filename: 'bundle.js',
        path: buildPath,
    },
    module: {

    },
    plugins: [
        new htmlWebpackPlugin({
            filename: "search.php",
            template: "app/Pages/Search/search.php"
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: "all"
        }
    }
};