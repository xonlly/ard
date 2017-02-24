
const http  = require( 'http' )
const url   = require( 'url' )
const path  = require( 'path' )
const fs    = require( 'fs' )

const webpackPort   = 14246
const frontPort     = 8046

const fileExist = function( path ){
    try{
        fs.accessSync( path )
        return true
    } catch( err ){
        return false
    }
}


const sources = [
    './vendors/agnostic-player'
]

http
    .createServer((req,res) => {

        const input_uri = url.parse(req.url).pathname

        const isFile    = input_uri.match(/\.[\w]{2,5}$/ )

        const fileName  = path.basename( input_uri )

        const localFile =
            isFile &&
            (
                sources.reduce(
                    ( s, x ) => {
                        const file = path.join( x, fileName )
                        return fileExist( file )
                            ? file
                            : s
                    },
                    null
                )
                ||
                sources.reduce(
                    ( s, x ) => {
                        const file = path.join( x, input_uri )
                        return fileExist( file )
                            ? file
                            : s
                    },
                    null
                )
            )

        if ( localFile )
            fs.createReadStream( localFile ).pipe(res, {end: true})

        else {

            const output_uri = isFile

                // is a file, serve it
                ? 'http://localhost:'+webpackPort+'/'+fileName

                // is a path, redirect to index.html
                : 'http://localhost:'+webpackPort+'/index.html'

            const proxy = http.request( output_uri , proxy_res => proxy_res.pipe(res, {end: true}) )

            req.pipe( proxy, {end: true} )
        }

    })

    .listen( frontPort )
