
import React from 'react'
import Webcam from './webcamv2';
import Card from 'material-ui/Card';
// import CardHeader from 'material-ui/CardHeader'
import CardTitle from 'material-ui/Card/CardTitle'
import CardText from 'material-ui/Card/CardText'

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const Camera = ({ screenshot, stats, list }) => {

/*
    stats.processing_time_ms
    stats.regions_of_interest
    stats.results
*/

    return (
        <div>
            { stats.results && stats.results.map( (x, i) => <Card key={ i }>
                    <CardTitle>{ x.plate }</CardTitle>
                    <CardText>{ 'Confidence: '+x.confidence}</CardText>
                    <CardText>{ 'Coordinates: '+JSON.stringify( x.coordinates ) }</CardText>
            </Card> )}
            <Webcam onData={ screenshot } />


            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Count</TableHeaderColumn>
                        <TableHeaderColumn>Plaque</TableHeaderColumn>
                        <TableHeaderColumn>Confidence</TableHeaderColumn>
                        <TableHeaderColumn>Coordinates</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    { list.map( x => <TableRow key={ x.plate }>
                        <TableRowColumn>{x.count}</TableRowColumn>
                        <TableRowColumn>{x.plate}</TableRowColumn>
                        <TableRowColumn>{x.confidence}</TableRowColumn>
                        <TableRowColumn>{JSON.stringify( x.coordinates )}</TableRowColumn>
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
