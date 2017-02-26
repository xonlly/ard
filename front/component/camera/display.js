
import React, { Component } from 'react'
import { findDOMNode } from 'react-dom';

//import './style.css'


export default class Display extends Component {

    componentWillUpdate( nextProps ) {
        const { width, height, list } = this.props

        const canvas = findDOMNode(this.refs.canvas)

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')

        list.forEach( elem => {
            ctx.beginPath();

            ctx.moveTo(elem[0].x, elem[0].y);
            ctx.lineTo(elem[1].x, elem[1].y);
            ctx.lineTo(elem[2].x, elem[2].y);
            ctx.lineTo(elem[3].x, elem[3].y);
            ctx.lineTo(elem[0].x, elem[0].y);

            ctx.stroke();
        })
    }


    render() {



        return (
            <canvas ref="canvas" />
        )
    }
}
