
import io from 'socket.io-client'

import initListen from './listen'
import initEmit from './emit'

module.exports = ( options = {} ) => {


    return store => {


        const socket = io.connect( `${options.host}:${options.port}` )

        socket.on('connect_failed', e => store.dispatch({ type : 'socket:fail', payload: e }) )
        socket.on('connect_error', e => store.dispatch({ type : 'socket:error', payload: e }) )
        socket.on('connect', e => store.dispatch({ type : 'socket:connect', payload: e }) )
        socket.on('disconnect', e => store.dispatch({ type : 'socket:disconnected', payload: e }) )

        return {

            destroy     : () =>
                socket.destroy()
            ,

            start       : () => {

                initListen( socket, store )
                initEmit( socket, store )
            },

            _close : () => socket._close()
            ,
        }
    }
}
