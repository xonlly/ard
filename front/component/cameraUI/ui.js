import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';

import './style/ui.css'

import Display from 'component/webcam/display'
import { Devices, Resolutions } from 'component/webcam/selector'
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

        getDevices().then( devices => this.setState({ devices }))

    }

    render() {

        const { devices } = this.state
        const { setDom, setDevice, setResolution, device, resolution } = this.props

        return (
            <div className="camera-ui">
                <Devices list={ devices } value={ device && device.deviceId } onChange={ setDevice } />
                <Resolutions value={ resolution } onChange={ setResolution }/>
                <Display
                    onVideo={ video => setDom({ video }) }
                    onCanvasVR={ canvasVR => setDom({ canvasVR }) }
                    onCanvasScreen={ canvasScreen => setDom({ canvasScreen }) }
                    />
                <div className="debug" />
            </div>
        )
    }

}
