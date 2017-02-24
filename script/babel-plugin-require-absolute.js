const fs = require('fs')
const pathUtils = require('path')


const fileExist = function( path ){
    try{
        fs.accessSync( path )
        return true
    } catch( err ){
        return false
    }
}

const moduleExist = function( path ){
    return path.slice(-3) != '.js'
        ? fileExist( path+'.js' ) || fileExist( path+'/index.js' )
        : fileExist( path )
}

/**
 *
 * @param cwd               {string}       path from where the command is called
 * @param moduleDirectory   {[]string}     list of path from where to check for modules ( relative to cwd )
 * @param src               {string}       the source as specified by the require
 * @param filename          {string}       the filename ( with path ) from where the require is
 *
 * @return {string} the path to the module found, relative to the path of the current file
 *                  or src if nothing is found
 */
// example :
// cwd              :   /user/platane/githug/trcktl
// filename         :   /user/platane/githug/trcktl/src/component/button
// src              :   agnostic-player
// moduleDirectory  :   [ vendors ]
//
// fromDirectory    :   ./src/component/button
const getRelativePath = function( cwd, moduleDirectory, src, filename ){

    src = src.trim()

    // ignore this cases
    if ( !src || src[0] == '.' || src[0] == '/' )
        return src

    moduleDirectory = moduleDirectory || [ 'web_modules']

    // test the existence of the file in each rootDirectory
    // if it exist in two directories, the first in the list have the priority
    for( var i=moduleDirectory.length; i--; ) {

        const pathToModule = pathUtils.join( cwd, moduleDirectory[i], src )

        if ( moduleExist( pathToModule ) )

            return './'+pathUtils.join( pathUtils.relative( pathUtils.dirname( filename ), cwd ), moduleDirectory[i], src )

    }

    return src
}

module.exports = function ( a ) {

    const cwd = process.cwd()

    return {
        visitor:{
            CallExpression: function( path, parent ){

                if ( path.node.callee.name == 'require' ) {
                    const arg = path.node.arguments[ 0 ]

                    arg.value = getRelativePath(
                        cwd,
                        parent.opts && parent.opts.moduleDirectory,

                        arg.value,

                        // /!\ sometimes the filename is absolute, sometimes not, I can't figure out why
                        parent.file.opts.filename
                    )
                }
            },

            ImportDeclaration: function( path, parent ) {

                path.node.source.value = getRelativePath(
                    cwd,
                    parent.opts && parent.opts.moduleDirectory,

                    path.node.source.value,

                    // /!\ sometimes the filename is absolute, sometimes not, I can't figure out why
                    parent.file.opts.filename
                )

            }
        }
    }
}
