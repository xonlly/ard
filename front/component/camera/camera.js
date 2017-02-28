
import React    from 'react'
import Webcam   from './webcamv2';
import Display  from './display'

// import CardHeader from 'material-ui/CardHeader'
import Card           from 'material-ui/Card';
import CardTitle      from 'material-ui/Card/CardTitle'
import CardText       from 'material-ui/Card/CardText'
import LinearProgress from 'material-ui/LinearProgress';
import Paper          from 'material-ui/Paper';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const style = {
  height: 600,
  width: 'calc( 50% - 40px )',
  margin: 15,
  display: 'inline-block',
  verticalAlign: 'top',
  overflow: 'auto',
};

const plateStr = ( x ) => {
    const a = x.split('')
    return `${a[0]}${a[1]}-${a[2]}${a[3]}${a[4]}-${a[5]}${a[6]}`
}

const Camera = ({ screenshot, setSize, size, stats, list }) => {
    return (
        <div>
            <Paper style={ { ...style, width : 'calc( 60% - 30px )', height :'1000px', overflow : 'auto', backgroundColor: 'rgb(0, 188, 212)' }}>
                <Webcam keyScreenshot={ stats.epoch_time ? stats.epoch_time : 1 } onData={ screenshot } videoSize={ s => setSize( s ) }>
                    <Display width={ size.width } height={ size.height } list={ stats.results ? stats.results.map( x => x.coordinates ) : [] } />
                </Webcam>
            </Paper>

            <Paper style={{ ...style, width : 'calc( 40% - 30px )' }}>
                { stats.results && stats.results.map( (x, i) => <Card key={ i }>
                    <CardTitle>{ x.plate }</CardTitle>
                    <CardText>{ 'Confidence: '+x.confidence}</CardText>
                </Card> )}
            </Paper>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Count</TableHeaderColumn>
                        <TableHeaderColumn>Plaque</TableHeaderColumn>
                        <TableHeaderColumn>Confidence</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { list.map( x => <TableRow key={ x.plate }>
                        <TableRowColumn>{x.count}</TableRowColumn>
                        <TableRowColumn>{plateStr( x.plate )}</TableRowColumn>
                        <TableRowColumn><LinearProgress mode="determinate" value={x.confidence} /></TableRowColumn>
                    </TableRow>) }


                </TableBody>
            </Table>

        </div>
    )
}

export default Camera

/*
ARD
{"plate":"0546GYY","confidence":86.704109,"matches_template":0,"plate_index":0,"region":"","region_confidence":0,"processing_time_ms":17.173223,"requested_topn":10,"coordinates":[{"x":82,"y":428},{"x":239,"y":414},{"x":242,"y":443},{"x":86,"y":460}],"candidates":[{"plate":"0546GYY","confidence":86.704109,"matches_template":0},{"plate":"Q546GYY","confidence":84.305138,"matches_template":0},{"plate":"D546GYY","confidence":80.808037,"matches_template":0},{"plate":"O546GYY","confidence":80.797104,"matches_template":0},{"plate":"0S46GYY","confidence":80.703148,"matches_template":0},{"plate":"054GGYY","confidence":79.562767,"matches_template":0},{"plate":"05460YY","confidence":79.002106,"matches_template":0},{"plate":"054SGYY","confidence":78.922661,"matches_template":0},{"plate":"G546GYY","confidence":78.699974,"matches_template":0},{"plate":"0546CYY","confidence":78.50573,"matches_template":0}]}

*/
