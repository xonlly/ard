
import {connect}        from 'component/abstract/connect'

import Camera from './camera'

import { screenshot } from 'action/camera'

export default connect(

    // fragments

    [
        'alpr.stats',
        'alpr.list',
    ],

    // renames
    ( stats, list ) => ({ stats, list }),

    dispatch => ({
        screenshot : data => dispatch( screenshot( data ) ),
    }),


)( Camera )
