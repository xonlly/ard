

export const pic = ( action, _pic ) => {

    _pic = _pic || ''

    if ( action.type == 'ask-camera:screenshot' )
        return action.payload.data


    return _pic


}

pic.source = true
