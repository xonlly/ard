
import {connect}        from 'component/abstract/connect'

import Camera from './camera'

import { screenshot, size } from 'action/camera'

export default connect(

    // fragments

    [
        'alpr.stats',
        'alpr.list',
        'camera.size'
    ],

    // renames
    ( stats, list, size ) => ({ stats, list, size }),

    dispatch => ({
        screenshot : data => dispatch( screenshot( data ) ),
        setSize : data => dispatch( size( data ) ),
    }),


)( Camera )
