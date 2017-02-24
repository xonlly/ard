
require('file-loader?name=index.html!./index.html')

import * as config      from 'config'
import init             from 'init'

import * as reducerFragment          from 'reducer'

import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

init(
    reducerFragment,
    {
        ui                  : require('system/ui')( config.ui ),
        // live                : require('system/live')( config.live ),
    }
)
    .then( x => {

        if ( 'production' != process.env.ENV_NODE ) {

            window.store    = x.store
            window.systems  = x.systems
        }

        return x
    })
