/* global tracking */

import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Tracking from 'tracking'


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
            list_pictures : [],
        }
    }

    takeScreenshot() {

        const canvas = findDOMNode(this.refs.canvas)
        const video = findDOMNode(this.refs.video)

        if ( !video || !canvas || !this.stream )
            return false

        const { videoSize } = this.props

        const ratio = video.videoWidth / video.videoHeight

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight / ratio


/*
        if ( videoSize ) {
            videoSize({ width : canvas.width, height : canvas.height })
        }
*/



        const { screenshotFormat } = this.state
        const { onData } = this.props

        const list_pictures = []
        this.state.tracking.forEach( elem => {

            const ctx = canvas.getContext('2d')

            ctx.drawImage(video, elem.x, elem.y, elem.width, elem.height);

            list_pictures.push( canvas.toDataURL( screenshotFormat ) )

        })

        console.log({list_pictures})

        this.setState({ list_pictures })
        // onData && onData(  )

    }

    componentDidMount() {

        navigator.mediaDevices.enumerateDevices()
            .then( devices => {
                this.setState({ devices })
            })



    }

    startTracker() {
        const video = findDOMNode(this.refs.video)

        console.log('Tracking', tracking)

        tracking.ColorTracker.registerColor('purple', function(r, g, b) {
            var dx = r - 255;
            var dy = g - 255;
            var dz = b - 255;
            if ((b - g) >= 100 && (r - g) >= 60) {
              return true;
            }
            return dx * dx + dy * dy + dz * dz < 3500;
        });

        const tracker = new tracking.ColorTracker(['purple']);

        tracking.track(video, tracker, { camera: true });

        tracker.on('track', event => {
            this.setState({ tracking : event.data })
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

            setTimeout( () => {
                this.startTracker()

            }, 2000 )

            setInterval(() => this.takeScreenshot(), 4000)
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


        const { src, devices, selected, list_pictures } = this.state

        return (
            <div>

                <div style={{display: 'flex'}}>
                    { list_pictures.map( (e, i) => <img key={i} src={e}  /> ) }
                </div>
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
                    <canvas ref="canvas" />

                    <div style={{ position : 'absolute', top: 0}}>
                        { React.cloneElement(this.props.children, { tracking : this.state.tracking }) }
                    </div>
                </div>
                    }
            </div>
        )
    }

}
