import webpack from 'webpack';
import config from './webpack.config.base.babel';

// configure dev server
config.devServer = {
    disableHostCheck: true,
    hot: true,
    https: false,
    port: process.env.PORT || 3333,
    stats: 'errors-only',
};

config.devtool = 'inline-source-map';

// adds Hot Module Reloading
config.plugins.push(new webpack.HotModuleReplacementPlugin());

config.mode = 'development';

export default config;
