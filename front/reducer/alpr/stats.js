
export const stats = ( action, _stats ) => {
    _stats = _stats || {}

    if ( action.type == 'alpr:data' ) {

        const data = action.payload
        return {
            ...data,
            results : data.results.filter( y => /([A-z]{2}[0-9]{3}[A-z]{2})/.test(y.plate) && y.plate.length == 7 ),
        }
    }

    return _stats
}

stats.source = true
