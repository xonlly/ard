

export const size = ( action, _size ) => {

    _size = _size || { width : 500, height : 500 }

    if ( action.type == 'ask-camera:size' )
        return action.payload.data


    return _size


}

size.source = true
