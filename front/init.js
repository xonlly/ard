
import 'babel-polyfill'
import 'whatwg-fetch'

import createReducer     from 'refinery-js'
import {
    createStore,
    applyMiddleware,
    compose
}                        from 'redux'
import genUID            from 'util/uid'
import devToolsEnhancer  from 'remote-redux-devtools'

const crashReporter = store => next => action => {
    try {
        return next(action)
    } catch (err) {
        console.error('Caught an exception!', err)
        throw err
    }
}

module.exports = async ( reducerFragment, systemIniters, name_for_devTool = 'ARD' ) => {

    // create the reducer from the fragments
    const { reduce, initState } = createReducer( reducerFragment )

    // create redux store
    const middlewares = [
        crashReporter,
    ]

    const devToolsParams = {
        name: `${name_for_devTool} - ${genUID()}`,
        maxAge: 50, latency: 500
    }

    const enhancers = [
        ...(
            'undefined' != typeof window && window.__REDUX_DEVTOOLS_EXTENSION__
                ? [ window.__REDUX_DEVTOOLS_EXTENSION__( devToolsParams ) ]
                : ( devToolsEnhancer ? [
                    devToolsEnhancer( devToolsParams )
                ] : [] )
        ),
        applyMiddleware( ...middlewares ),
    ]
    const store = createStore( reduce, initState, compose( ...enhancers ) )


    // add useful method
    {
        let lastState = store.getState()

        const listeners = []

        store.subscribe( () => {

            const newState = store.getState()

            listeners
                .filter( ({ watched }) => watched.some( key => newState[key] != lastState[key] ) )
                .forEach( ({ watched, callback }) => callback( ...watched.map( key => newState[key] ) ) )

            lastState = newState
        })

        store.watch = ( ...args ) => {

            const watched   = args.slice(0,-1)
            const callback  = args.slice(-1)[ 0 ]
            const key       = genUID()

            listeners.push({ watched, callback, key })

            return () => {
                const i = listeners.findIndex( x => key == x.key )
                if ( i >= 0 )
                    listeners.splice( i, 1 )
            }
        }

        store.watchAndCallImmediately = ( ...args ) => {
            const res = store.watch( ...args )

            const { watched, callback } = listeners[ listeners.length-1 ]

            const state = store.getState()

            callback( ...watched.map( key => state[key] ) )

            return res
        }

    }


    const systems = {}

    // init all systems
    await Promise.all(
        Object.keys( systemIniters )
            .map( name =>
                Promise.resolve()
                    .then( () => systemIniters[ name ]( store ) )
                    .then( s => systems[ name ] = s )
            )
    )

    // call start on all systems
    Object.keys( systems )
        .forEach( name => systems[ name ] && systems[ name ].start && systems[ name ].start( systems ) )


    // prepare to destroy
    const destroy = () =>
        Promise.all(
            Object.keys( systems )
                .filter( name => systems[ name ] && systems[ name ].destroy )
                .map( name => systems[ name ].destroy() )
        )

    store.systems = systems

    return {store, systems, destroy}
}
