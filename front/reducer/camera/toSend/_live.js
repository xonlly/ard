
import genUID                       from 'util/uid'

export const _live = ( pic, _pic ) => {
    if ( pic == _pic )
        return []

    return [{
        eventName   : 'screenshot:set',
        data        : { pic },
        errType     : 'fail-screenshot:set',
        resType     : 'screenshot:patch',
        meta        : { key : genUID() },
    }]

}

_live.dependencies = []
