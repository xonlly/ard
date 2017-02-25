

export const app = () => true

export const socket = ( action, _socket ) => {

    _socket = _socket || false

    if ( action.type == 'socket:disconnected' )
        return false

    if ( action.type == 'socket:connect' )
        return true

    return _socket

}

socket.source = true
