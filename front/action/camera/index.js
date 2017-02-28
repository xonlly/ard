
export const screenshot = ( data ) => ({
    type    : 'ask-camera:screenshot',
    payload : { data },
})

export const size = ( data ) => ({
    type    : 'ask-camera:size',
    payload : { data },
})

export const setDom = dom => ({
    type : 'ask-camera:dom',
    payload : dom,
})

export const setDevice = device => ({
    type : 'ask-camera:device',
    payload : device,
})

export const setResolution = resolution => ({
    type : 'ask-camera:resolution',
    payload : resolution,
})
