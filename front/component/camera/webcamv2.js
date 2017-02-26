

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

        // this.interval = setInterval(() => this.takeScreenshot(), 2000);

        this.state = {
            src : null,
            selected : false,
            videoSource : false,
            audioSource : false,
            screenshotFormat : 'image/jpeg',
            devices : [],
        }
    }

    takeScreenshot() {

        const canvas = findDOMNode(this.refs.canvas)
        const video = findDOMNode(this.refs.video)

        if ( !video || !canvas || !this.stream )
            return false

        const { videoSize } = this.props



        const ratio = video.videoWidth / video.videoHeight

        canvas.width = video.clientWidth
        canvas.height = video.clientWidth / ratio

        if ( videoSize ) {
            videoSize({ width : canvas.width, height : canvas.height })
        }

        const ctx = canvas.getContext('2d')

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const { screenshotFormat } = this.state
        const { onData } = this.props

        onData && onData( canvas.toDataURL( screenshotFormat ) )

    }

    componentDidMount() {

        navigator.mediaDevices.enumerateDevices()
            .then( devices => {
                this.setState({ devices })
            })

    }

    componentWillUpdate( nextProps, nextState ) {


        if ( JSON.stringify( nextState.videoSource ) == JSON.stringify( this.state.videoSource ) ) {
            const { videoSource, audioSource } = nextState

            // Demande le prochain screen car il y a eu un résultat
            if ( videoSource && nextProps.keyScreenshot != this.props.keyScreenshot ) {
                this.takeScreenshot()
            }

            return false
        }


        const { videoSource, audioSource } = nextState

        // Premier screen apres le stream video
        if ( videoSource ) {
            setTimeout( () => this.takeScreenshot(), 2000 )
        }

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
                <div style={{ height : '70px' }}>
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
                </div>
                { selected && <div style={{ position: 'relative' }}>
                    <video
                        ref="video"
                        autoPlay
                        src={ src }
                        width="100%"
                        />
                    <canvas style={ { display: 'none' } } ref="canvas" />
                    <div style={{ position : 'absolute', top: 0}}>
                        { this.props.children }
                    </div>
                </div>
                    }
            </div>
        )
    }

}
