
const adaptaters = { }

module.exports = ( socket, store ) => {

    const done = {}

    store.watchAndCallImmediately( 'service.live.toStart', 'app.ready.socket', ( toStart, ready ) => {

        if ( !ready )
            return

        toStart
            .filter( x => !done[ x.meta.key ] )
            .forEach( x => {

                const adaptater = adaptaters[ x.eventName ] || {}

                const { meta, eventName, data, resType, errType } = adaptater.format && adaptater.format( x ) || x

                done[ meta.key ] = true

                socket.emit( eventName, data )
                /*    .then( res =>
                        store.dispatch({
                            type        : resType || 'success-live:send',
                            payload     : { meta, ...( adaptater.parse && adaptater.parse( res, data ) || res || {} ) },
                            meta        : { ...meta, from_live: true, ok: true },
                        })
                    )
                    .catch( res =>
                        store.dispatch({
                            type        : errType || 'fail-live:send',
                            payload     : { meta, ...res },
                            meta        : { ...meta, from_live: true, ok: false },
                        })
                    )
*/

            })


    })
}
