
import { hex } from 'util/color'

export const list = ( stats, _list ) => {

    _list = _list || []

    if ( stats.results ) {
        stats.results.forEach( x => {

            _list = _list
                .map( l => l.plate == x.plate ? { ...l, count : l.count + 1 } : l )

            if ( !_list.some( l => l.plate == x.plate ) ) {
                _list.push( { ...x, count : 1, color : hex() } )
            }

        } )
    }

    return _list

}

list.dependencies = [ 'alpr.stats' ]
