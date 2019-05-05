var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = [{
    entry: './src/main.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        library: 'react-js-diagrams'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
        })
    ],
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.js[x]{0,1}$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
    resolve: {
        extensions: ['.js']
    },
    devtool: 'source-map'
},
//for building the demos and tests
    {
        entry: {
            'demo4/bundle.js': './demos/demo4/index.js',
        },
        output: {
            filename: '[name]',
            path: path.join(__dirname, 'demos')
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.js[x]{0,1}$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js']
        },
        devtool: 'source-map'
    },

    {
        entry: {
            'workflow/bundle.js': './demos/demo4/index.js',
        },
        output: {
            filename: '[name]',
            path: path.join(__dirname, 'demos')
        },
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    use: [{
                        loader: "style-loader" // creates style nodes from JS strings
                    }, {
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }]
                },
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: "source-map-loader"
                },
                {
                    test: /\.js[x]{0,1}$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js']
        },
        devtool: 'source-map'
    }];
