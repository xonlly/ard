
export const stats = ( action, _stats ) => {
    _stats = _stats || {}

    if ( action.type == 'alpr:data' )
        return action.payload

    return _stats
}

stats.source = true
