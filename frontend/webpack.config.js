/**created by panchong on 2018/2/11**/
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './main.js',
    output: {
        path:  path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[hash].js',
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'react'],
                        plugins: [
                            'transform-runtime',
                            ['import', { 'libraryName': 'antd', 'style': 'css' }]
                        ],
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
            },
            {
                test: /\.less$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'less-loader'] }),
            },
            {
                test: /\.(jpg|jpeg|png|gif)$/,
                loader: 'file-loader',
                options: {
                    limit: 8192,
                    name: '[name].[hash].[ext]',
                    outputPath: 'images/',
                }
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: true
                    }
                }],
            },
            {
                loader: 'image-webpack-loader',// 压缩图片文件
                options: {
                    bypassOnDebug: true,
                }
            },
            {
                test: /\.(woff|woff2|svg|eot|ttf)$/,
                use: ['file-loader'],
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            DEV_STATE: JSON.stringify(JSON.parse(process.env.DEV || 'false'))
        }),
        new ExtractTextPlugin('css/[id].[hash].css'),
        new HtmlWebpackPlugin({
            // 压缩配置
            minify: {
                removeAttributeQuotes: true         // 去掉标签上属性的引号
            },
            hash: true,
            template: path.join(__dirname, '/index-tmpl.html'),
            excludeChunks: ['front'],
        }),
        new CleanWebpackPlugin(
            ['dist'], // 匹配删除的文件
            {
                root: __dirname,
                verbose: true,
                dry: false,
            }
        ),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),     // 基本目录结构（服务器根目录）
        host: 'localhost',                           // 服务器地址（可以使用IP也可以使用localhost，用ipconfig命令查看自己的IP）
        port: 3000,                                       // 端口
        compress: true                                    // 是否启用服务器压缩
    },
};