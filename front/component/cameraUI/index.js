
import {connect}        from 'component/abstract/connect'

import CameraUI from './ui'

import {
    setDom,
    setDevice,
    setResolution,
    setSrc,
} from 'action/camera'

export default connect(

    // fragments
    [
        'camera.dom',
        'camera.device',
        'camera.resolution',
        'camera.src',
    ],

    // renames
    ( doms, device, resolution, src ) => ({
        doms,
        device,
        resolution,
        src,
    }),

    // functions
    dispatch => ({

        setDom : dom => dispatch( setDom( dom ) ),
        setDevice : device => dispatch( setDevice( device ) ),
        setResolution : resolution => dispatch( setResolution( resolution ) ),
        setSrc : src => dispatch( setSrc( src ) ),
    }),


)( CameraUI )
