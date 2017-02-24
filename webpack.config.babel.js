const fs                    = require('fs')
const path                  = require('path')
const webpack               = require('webpack')
const pkg                   = require('./package.json')

const production            = process.env.NODE_ENV == 'production'

module.exports = {

    entry:
        production
            ? {
                'app'       : [ 'babel-polyfill', './front/index.js' ],

            }
            : {
                'app'       : [ './front/index.js' ],

                // vendors in another chunk to minimize the files size ( too large and it's a pain to open in debugger s)
                'vendor'    : [ 'babel-polyfill', 'react-dom', 'react', 'refinery-js', 'expect', 'engine.io-client', 'redux', 'react-redux'],

            }
    ,

    output: {
        path        : path.join(__dirname, 'dist'),
        filename    : production
            ? '[hash:8].js'
            : '[name].js'
    },

    module: {

        rules: [
            {
                test    : /\.js$/,
                exclude : /(node_modules|vendors)/,
                use     : 'babel-loader',
            },

            {
                test    : /\.html?$/,
                use     : 'html-minify-loader',
            },

            {
                test    : /\.css$/,
                use     : [
                    {
                        loader  : 'style-loader',
                    },
                    {
                        loader  : 'css-loader',
                    },
                    {
                        loader  : 'postcss-loader',
                    },
                ],
            },

            {
                test    : /\.mcss$/,
                use     : [
                    {
                        loader  : 'style-loader',
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            modules         : true,
                            importLoaders   : 1,
                            localIdentName  : production
                                ? '[hash:6]'
                                : '[path][name]---[local]'
                            ,
                        },
                    },
                    ...( production
                        ? [{ loader  : 'postcss-loader' }]
                        : []
                    ),
                ],
            },

            {
                test    : /\.(json|eot|ttf|woff|woff2|svg|gif|jpg|png|bmp)$/,
                use     : [
                    {
                        loader  : 'file-loader',
                        options : {
                            name    : '[hash:8].[ext]',
                        }
                    }
                ],
            },

        ],
    },

    plugins: [


        new webpack.DefinePlugin({

            // env var
            ...(
                    [
                    'NODE_ENV',
                    ]
                    .reduce( (o,name) =>
                        !(name in process.env)
                            ? o
                            : { ...o, [ 'process.env.'+name ] : `'${ process.env[ name ] }'`}
                    ,{})
            ),
            '__VERSION__' :  `'${ pkg.version }'`,
        }),

        ...(
            production
                ? [

                    // force fail on error
                    function(){
                        this.plugin('done', stats => {
                            if ( stats.compilation.errors && stats.compilation.errors.length ) {
                                console.log(stats.compilation.errors);
                                process.exit(1);
                            }
                        })
                    },

                    // write stat
                    function(){
                        this.plugin('done', stats =>
                            fs.writeFileSync(
                                path.join(__dirname, 'webpack-stats.json'),
                                JSON.stringify(stats.toJson())
                            )
                        )
                    },

                    // minify
                    new webpack.optimize.UglifyJsPlugin({ compress: {warnings: false} }),
                ]

                : [

                    // split into chunk ( only for the sake of having smaller files )
                    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename:'vendor.bundle.js' }),
                ]
        )
    ],
}
