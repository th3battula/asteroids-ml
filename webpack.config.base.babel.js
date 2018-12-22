import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig = {
    entry: './src/index.js',
    mode: 'production',
    module: {
        rules: [{
            exclude: path.resolve(__dirname, 'node_modules'),
            test: /\.(jpg|jpeg|gif|png|ico|svg)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'assets/img/[name].[ext]',
                    outputPath: 'static/',
                },
            },
        }, {
            exclude: path.resolve(__dirname, 'node_modules'),
            test: /\.(ttf)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]',
                    outputPath: 'static/',
                },
            },
        }, {
            include: path.resolve(__dirname, 'src'),
            loader: 'babel-loader',
            test: /\.js$/,
        }],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
    },
    plugins: [
        new webpack.WatchIgnorePlugin([path.resolve(__dirname, './dist')]),
        new HtmlWebpackPlugin({
            template: './index-template.html',
            title: 'Asteroids NEAT',
        }),
    ],
    stats: 'errors-only',
};

export default webpackConfig;
