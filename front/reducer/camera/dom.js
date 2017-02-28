

export const dom = ( action, _dom ) => {

    _dom = _dom || {}

    if ( action.type == 'ask-camera:dom' ) {

        const doms = action.payload

        Object.keys( doms ).forEach( dom => {
            _dom[ dom ] = doms[ dom ]
        })
    }


    return _dom


}

dom.source = true
