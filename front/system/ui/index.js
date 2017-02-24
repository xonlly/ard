import ReactDOM         from 'react-dom'
import {Provider}       from 'react-redux'
import React            from 'react'

import App              from 'component/app'

module.exports = config => store => {

    let done

    const unwatch = store.watchAndCallImmediately(
        'app.ready.app',
        ready => {

            if ( !ready || done )
                return false

            done = true

            const element = ( config.container && config.container.appendChild && config.container )
                ||
                ( config.container && document.getElementById(config.container) )
                ||
                document.body

            ReactDOM.render( <Provider store={store}><App /></Provider>, element )
        }
    )

    return {
        destroy : unwatch
    }
}
