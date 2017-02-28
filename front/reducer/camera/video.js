

export const device = ( action, device ) => {

    device = device || false

    if ( action.type == 'ask-camera:device' )
        return action.payload

    return device


}

device.source = true


export const resolution = ( action, resolution ) => {

    resolution = resolution || 1920

    if ( action.type == 'ask-camera:resolution' )
        return action.payload

    return resolution


}

resolution.source = true

export const src = ( action, src ) => {

    src = src || false

    if ( action.type == 'ask-camera:src' )
        return action.payload

    return src


}

src.source = true
