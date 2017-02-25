

module.exports = ( socket, store ) =>
    socket
        .on('alpr:data', payload =>
            store.dispatch({ type: 'alpr:data', payload })
        )
