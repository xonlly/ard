import React, { Component, PropTypes } from 'react'
import { findDOMNode } from 'react-dom';

import './style/display.css'

export default class Display extends Component {

    static propTypes = {
        onVideo : PropTypes.func.isRequired,
        onCanvasVR: PropTypes.func.isRequired,
        onCanvasScreen: PropTypes.func.isRequired,
    }

    componentDidMount() {

        // return a dom
        const { onVideo, onCanvasVR, onCanvasScreen } = this.props

        const canvasScreen = findDOMNode(this.refs.canvasScreen)
        const canvasVR = findDOMNode(this.refs.canvasVR)
        const video = findDOMNode(this.refs.video)

        if ( canvasScreen ) {
            onCanvasScreen( canvasScreen )
        }

        if ( canvasVR ) {
            onCanvasVR( canvasVR )
        }

        if ( video ) {
            onVideo( video )
        }

    }

    render() {

        const { src } = this.props

        return (
            <div className="display">
                <canvas className="vr" ref="canvasVR" />
                <video
                    ref="video"
                    autoPlay
                    src={ src }

                    />
                <canvas style={{ display: 'none' }} className="screen" ref="canvasScreen" />
            </div>
        )
    }

}
