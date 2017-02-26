
export const screenshot = ( data ) => ({
    type    : 'ask-camera:screenshot',
    payload : { data },
})

export const size = ( data ) => ({
    type    : 'ask-camera:size',
    payload : { data },
})
