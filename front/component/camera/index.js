
import React from 'react'
import Webcam from './webcamv2';


const Camera = () => {


    return (
        <div>
            <Webcam  onData={ x => console.log(x) } />
        </div>
    )
}

export default Camera
