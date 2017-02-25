

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

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
            selected : false,
            videoSource : false,
            audioSource : false,
            screenshotFormat : 'image/jpeg',
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
            || nextState.videoSource != this.state.videoSource
            || nextState.audioSource
            || nextState.selected != this.state.selected
    }

    componentWillUnmount() {
        clearInterval( this.interval )
    }

    render() {


        const { src, devices, selected } = this.state

        return (
            <div>
                <DropDownMenu
                    value={ selected }
                    onChange={ (event, index, value) => !value
                        ? this.setState({ selected : false, videoSource : false, src : null })
                        : this.setState({ selected : value, videoSource : devices.find( x => x.deviceId == value ) })
                    }
                    openImmediately={true}>
                        <MenuItem value={ false } primaryText="Select a camera" />
                        { devices.filter( x => x.kind == 'videoinput' ).map( x =>
                            <MenuItem
                                key={ x.deviceId }
                                value={ x.deviceId }
                                primaryText={ x.label }
                                />
                        )
                    }
                </DropDownMenu>
                { selected && <div>
                    <video
                        ref="video"
                        autoPlay
                        src={ src }
                        />
                    <canvas style={ { display: 'none' } } ref="canvas" />
                </div>
                    }
            </div>
        )
    }

}
