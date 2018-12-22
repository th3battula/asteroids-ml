import UglifyJsPlugin from 'uglify-js-plugin';
import config from './webpack.config.base.babel';

config.optimization = {
    minimize: true,
    minimizer: [
        new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true,
        }),
    ],
    splitChunks: {
        cacheGroups: {
            styles: {
                name: 'styles',
                test: /\.s?css$/i,
                chunks: 'all',
                enforce: true,
            },
        },
    },
};

export default config;
