
const handlers = [
    require('./alpr'),
]

module.exports = ( socket, store ) =>
    handlers.forEach( x => x( socket, store ) )
