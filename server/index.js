
import ioS from 'socket.io'
import path from 'path'

import { live } from './config'

const io = ioS( live.port )

const video = path.join( __dirname, 'cam.jpg' )

const exec = require('child_process').exec;

const alpr = () => new Promise( ( resolve, reject ) => {

    exec('alpr -c eu -j ' + video, (error, stdout, stderr) => {
        if ( error ) {
            reject( error )
            return;
        }

        try {
            resolve( JSON.parse( stdout ) )
        } catch( e ) {
            reject('fail parse json')
        }


    });

} )

import fs from 'fs'

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};

    if ( !matches )
        return false

    if (matches.length !== 3)
        return false

    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    return response;
}


io.on('connection', socket => {

    socket.on('screenshot:set', data => {
        if ( !data ) return false

        const decoded = decodeBase64Image( data.pic )

        if ( !decoded )
            return false

        fs.writeFile(video , decoded.data, 'binary', function(err){
            if (err) throw err

            alpr()
                .then( data => socket.emit( 'alpr:data', data ) )
                .catch( error => console.log('error', error) )
        })
    })

})
