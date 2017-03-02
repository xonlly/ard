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
        tracking.ColorTracker.registerColor('b', function(r, g, b) {
            var dx = r - 245;
            var dy = g - 248;
            var dz = b - 255;
            if ((b - g) >= 100 && (r - g) >= 60) {
              return true;
            }
            return dx * dx + dy * dy + dz * dz < 3500;
        });

        const tracker = new tracking.ColorTracker(['b']);

        tracking.track(video, tracker, { camera: true });

        tracker.on('track', event => {
            tracked = event.data.filter( x => x.width > 400 && x.height > 300)
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


            tracked.forEach( elem => {
                ctxVr.beginPath();
                ctxVr.strokeStyle="purple";
                /*ctxVr.moveTo(elem.x, elem.y);
                ctxVr.lineTo(elem.x + elem.width, elem.y);
                ctxVr.lineTo(elem.x + elem.width, elem.y + elem.height);
                ctxVr.lineTo(elem.x, elem.y + elem.height);
                ctxVr.lineTo(elem.x, elem.y);*/

                ctxVr.fillRect(elem.x, elem.y, elem.width, elem.height)
                ctxVr.stroke();
            })

            // ctxVr.drawImage( video, 0, 0, video.clientWidth, video.clientHeight )





            stats.end();
            requestAnimationFrame( animate );
        }

        requestAnimationFrame( animate );

        setInterval( () => {

            canvasVR.width = video.clientWidth
            canvasVR.height = video.clientHeight

            const imgs = tracked.map( elem => {
                return '<img src="'+getData( elem.x, elem.y, elem.width, elem.height )+'" />'
            })

            document.querySelector('.debug').innerHTML = imgs.join('')
        }, 1000)

    }


    return store => {

        store.watchAndCallImmediately( 'camera.dom', 'camera.device', 'camera.resolution', ( doms, device, resolution ) => {

            if ( !readyVR ) {
                readyVR = true
                VR({ doms })
            }

            if ( device ) {
                const constraints = {
                    video : {
                        // width: resolution,
                        optional : [ { sourceId : device.deviceId } ]
                    }
                }

                navigator.getUserMedia( constraints, stream => {
                    store.dispatch({ type : 'ask-camera:src', payload : window.URL.createObjectURL(stream) })
                }, error => { console.log({ error })})

            } else {
                store.dispatch({ type : 'ask-camera:src', payload : false })
            }

        })

    }
}
