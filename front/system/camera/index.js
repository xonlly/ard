/* global navigator, tracking */

import Stats from 'stats.js'
import 'tracking'

module.exports = ( options = {} ) => {

    var readyVR = false

    var tracked = []

    const VR = ({ doms }) => {

        const { canvasScreen, canvasVR, video } = doms

        const stats = new Stats()

        // TRACKER §!!
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
            tracked = event.data
        })
        // TRACKER §!!

        stats.dom.style='display: flex; top:0;'
        document.querySelector('.display').appendChild( stats.dom )

        stats.showPanel(0)

        const ctxScreen = canvasScreen.getContext('2d')
        const ctxVr = canvasVR.getContext('2d')


        const getData = ( x, y, width, height ) => {
            canvasScreen.width = width
            canvasScreen.height = height
            ctxScreen.drawImage(video, -x, -y );
            return canvasScreen.toDataURL('image/jpeg');
        }

        const animate = () => {
            stats.begin();

            // VR
            canvasVR.width = video.clientWidth
            canvasVR.height = video.clientHeight



            // ctxVr.drawImage( video, 0, 0, video.clientWidth, video.clientHeight )





            stats.end();
            requestAnimationFrame( animate );
        }

        requestAnimationFrame( animate );

        setInterval( () => {
            const imgs = tracked.map( elem => {
                return '<img src="'+getData( elem.x, elem.y, elem.width, elem.height )+'" />'
            })

            document.querySelector('.debug').innerHTML = imgs.join('')
        }, 1000)

    }


    return store => {

        store.watchAndCallImmediately( 'camera.dom', 'camera.device', 'camera.resolution', ( doms, device, resolution ) => {

            if ( !readyVR ) {
                VR({ doms })
                readyVR = true
            }

            const { canvasScreen, canvasVR, video } = doms

            if ( device ) {

                console.log({resolution})

                const constraints = {
                    video : {
                        // width: resolution,
                        optional : [ { sourceId : device.deviceId } ]
                    }
                }

                navigator.getUserMedia( constraints, stream => {

                    video.src = window.URL.createObjectURL(stream)

                }, error => { console.log({ error })})

            } else {
                // remove source
                video.src = false
            }

            console.log({ doms, device, resolution })

        })

    }
}
