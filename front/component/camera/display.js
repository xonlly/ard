
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';

//import './style.css'

import Stats from 'stats.js'


export default class Display extends Component {

    componentDidMount() {

        const canvas = findDOMNode(this.refs.canvas)
        const domStats = findDOMNode(this.refs.stats)
        const stats  = new Stats()


        stats.dom.style='display: flex; top:0;'
        domStats.appendChild( stats.dom )

        stats.showPanel(0)

        const animate = () => {
            stats.begin();

            const { width, height, list, tracking } = this.props



            canvas.width = width
            canvas.height = height

            const ctx = canvas.getContext('2d')

            ctx.font="15px Arial";

            if ( list )
                list.forEach( elem => {

                    ctx.beginPath();

                    ctx.fillText(`x${ elem[0].x } y${ elem[0].y }` ,elem[0].x,elem[0].y-5);

                    ctx.beginPath();
                    ctx.strokeStyle="red";
                    ctx.moveTo(elem[0].x, elem[0].y);
                    ctx.lineTo(elem[1].x, elem[1].y);
                    ctx.lineTo(elem[2].x, elem[2].y);
                    ctx.lineTo(elem[3].x, elem[3].y);
                    ctx.lineTo(elem[0].x, elem[0].y);

                    ctx.stroke();
                })

            if ( tracking )
                tracking.forEach( elem => {
                    ctx.beginPath();
                    ctx.strokeStyle="purple";
                    ctx.moveTo(elem.x, elem.y);
                    ctx.lineTo(elem.x + elem.width, elem.y);
                    ctx.lineTo(elem.x + elem.width, elem.y + elem.height);
                    ctx.lineTo(elem.x, elem.y + elem.height);
                    ctx.lineTo(elem.x, elem.y);
                    ctx.stroke();
                })

            stats.end();
            requestAnimationFrame( animate );
        }

        requestAnimationFrame( animate );
    }
/*
    componentWillUpdate( nextProps ) {

        const canvas = findDOMNode(this.refs.canvas)


    }

*/
    render() {



        return (
            <div style={{position:'relative'}}>
                <div ref="stats" style={{ position: 'absolute'}} />
                <canvas ref="canvas" />
            </div>
        )
    }
}
