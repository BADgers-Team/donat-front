const webpack = require('webpack');
const config = require('./webpack.config.js');

const prodConfig = {
    ...config,
    mode: 'production',
};
prodConfig.plugins.push(
    new webpack.DefinePlugin({
        BASE_BACKEND_URL: JSON.stringify('http://localhost:8080/api'),
    }),
);

module.exports = prodConfig;