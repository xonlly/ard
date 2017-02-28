
require('file-loader?name=index.html!./index.html')

import * as config      from 'config'
import init             from 'init'

import * as reducerFragment          from 'reducer'

import injectTapEventPlugin from 'react-tap-event-plugin';


// For camera
navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia

injectTapEventPlugin();

init(
    reducerFragment,
    {
        ui                  : require('system/ui')( config.ui ),
        live                : require('system/live')( config.live ),
        camera                : require('system/camera')( config.camera ),
    }
)
    .then( x => {

        if ( 'production' != process.env.ENV_NODE ) {

            window.store    = x.store
            window.systems  = x.systems
        }

        return x
    })
