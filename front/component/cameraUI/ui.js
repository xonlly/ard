import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';

import './style/ui.css'

import Display from 'component/webcam/display'
import { Devices, Resolutions, File } from 'component/webcam/selector'
import { getDevices } from 'component/webcam/utils'


export default class CameraUI extends Component {

    static propTypes = {
        setDom : PropTypes.func.isRequired,
    }

    constructor( ...args ) {
        super( ...args )

        this.state = {
            devices : [],
        }
    }

    componentDidMount() {

        const input = findDOMNode( this.refs.file )
        const { setSrc } = this.props
        input.addEventListener('change', function () {
            const url = URL.createObjectURL( this.files[0] )
            setSrc( url )
        }, false)

        getDevices().then( devices => this.setState({ devices }))

    }

    render() {

        const { devices } = this.state
        const { setDom, src, setDevice, setResolution, device, resolution } = this.props

        return (
            <div className="camera-ui">
                <Devices list={ devices } value={ device && device.deviceId } onChange={ setDevice } />
                <Resolutions value={ resolution } onChange={ setResolution }/>
                <input type="file" ref="file" accept="video/*" />

                <Display
                    src={ src }
                    onVideo={ video => setDom({ video }) }
                    onCanvasVR={ canvasVR => setDom({ canvasVR }) }
                    onCanvasScreen={ canvasScreen => setDom({ canvasScreen }) }
                    />
                <div className="debug" />
            </div>
        )
    }

}
