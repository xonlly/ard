export const createMerger_array = dependencies => {

    const merger = ( ...args ) => [].concat( ...args.slice(0,dependencies.length) )
    merger.dependencies = dependencies
    merger.stateless = true

    return merger
}

export const createMerger_boolean = dependencies => {

    const merger = ( ...args ) => args.slice(0,dependencies.length).reduce( (x,u) => x || u , false )
    merger.dependencies = dependencies
    merger.stateless = true

    return merger
}

export const createMerger_object = dependencies => {

    const merger = ( ...args ) =>
        args.slice(0,dependencies.length)
            .reduce( (o,u) => ({ ...o, ...u }), {} )
    merger.dependencies = dependencies
    merger.stateless = true

    return merger
}