

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import Chip from 'material-ui/Chip';

navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia


export default class Webcam extends Component {

    static propTypes = {

    }

    constructor() {
        super()

        this.stream = false

        this.interval = setInterval(() => {

            const canvas = findDOMNode(this.refs.canvas)
            const video = findDOMNode(this.refs.video)

            if ( !video || !canvas || !this.stream )
                return false

            const ratio = video.videoWidth / video.videoHeight

            canvas.width = video.clientWidth
            canvas.height = video.clientWidth / ratio

            const ctx = canvas.getContext('2d')

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const { screenshotFormat } = this.state
            const { onData } = this.props

            onData && onData( canvas.toDataURL( screenshotFormat ) )

        }, 2000);

        this.state = {
            src : null,
            videoSource : false,
            audioSource : false,
            screenshotFormat : 'image/webp',
            devices : [],
        }
    }

    componentDidMount() {

        navigator.mediaDevices.enumerateDevices()
            .then( devices => {
                this.setState({ devices })
            })

    }

    componentWillUpdate( nextProps, nextState ) {

        if ( JSON.stringify( nextState.videoSource ) == JSON.stringify( this.state.videoSource ) )
            return false


        const { videoSource, audioSource } = nextState

        const constraints = {}

        if ( videoSource )
            constraints.video = {
                optional : [ { sourceId: videoSource.deviceId } ]
            }

        if ( audioSource )
            constraints.audio = {
                optional : [ { sourceId: audioSource.deviceId } ]
            }


        if ( !constraints.video && !constraints.audio )
            return false


        navigator.getUserMedia( constraints, stream => {

            this.stream = stream

            this.setState({ src : window.URL.createObjectURL(stream) })

        }, error => {
            console.error('error', error)
        })

    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.src != this.state.src
            || nextState.devices.length != this.state.devices.length
            || nextState.videoSource
            || nextState.audioSource
    }

    componentWillUnmount() {
        clearInterval( this.interval )
    }

    render() {


        const { src, devices } = this.state


        return (
            <div>
                <div className="list-video">
                    {
                        devices.filter( x => x.kind == 'videoinput' ).map( x =>
                            <Chip
                                key={ x.deviceId }
                                backgroundColor={'#691b19'}
                                labelColor="white"
                                onTouchTap={ () => this.setState({ videoSource : x }) }
                                >{ x.label }</Chip>
                        )
                    }
                </div>
                <video
                    ref="video"
                    autoPlay
                    src={ src }
                    />
                <canvas ref="canvas" />
            </div>
        )
    }

}
