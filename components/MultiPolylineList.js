import React from 'react'
import {Polyline, Popup, FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'
import GenerateColor from './Colors'
import { UserActions } from '../actions'
import {LatLng} from 'leaflet'

class MultiPolylineList extends React.Component {

    handleRemovePolyline(index) {
        this.props.dispatch(UserActions.removePolylineFromIndex(index))
    }

    handleEditTimeEstimate(index, initValue) {
        let estimate = prompt("Oppgi estimert gangavstand i minutter", String(initValue || 0))
        if (estimate && !isNaN(estimate)) {
            this.props.dispatch(UserActions.editPolylineTimeEstimate(index, parseInt(estimate)))
        }
    }

    render() {

        const { multiPolylineDataSource } = this.props

        const polylinePopupStyle = {
            cursor: 'pointer',
            width: '100%',
            display: 'inline-block',
            marginTop: 10,
            textAlign: 'center',
            textDecoration: 'underline',
            fontWeight: 600
        }

        let lines = multiPolylineDataSource.map( (polyline, index) => {

            let coordsArray = arrayOfPolylinesFromPolyline(polyline)

            let color = GenerateColor(index)

            let estimateText = polyline.estimate ? (polyline.estimate + ' minutter') : 'Hvor lang tid tar denne ruten?'

            let latlngDistances = coordsArray.map ( (position) => new LatLng(position[0], position[1]))
            let totalDistance = 0
            let isCompleted = polyline.endQuay

            for (let i = 0; i < latlngDistances.length; i++) {
                if (latlngDistances[i+1] == null) break
                totalDistance += latlngDistances[i].distanceTo(latlngDistances[i+1])
            }

            return (
                <Polyline weight={6} key={'pl'+index} color={color} positions={coordsArray} opacity={isCompleted ? 0.8: 1.0} dashArray="8,14" lineJoin='round'>
                    <Popup key={'pl'+index}>
                        <div>
                            <div style={{fontWeight:600, width: '100%', textAlign: 'center', margin: 0, color: color, display: 'inline-block'}}>Ganglenke {index+1}</div>
                            <div>
                                <span
                                    style={{width: '100%', textAlign: 'center', marginTop: 10, fontWeight: 600, display: 'inline-block'}}
                                >{parseFloat(totalDistance.toFixed(2))} m</span>
                                <span
                                    style={polylinePopupStyle}
                                    onClick={() => this.handleEditTimeEstimate(index, polyline.estimate)}
                                >
                                    {estimateText}
                                </span>
                                <span
                                    onClick={() => this.handleRemovePolyline(index)}
                                    style={polylinePopupStyle}
                                >Remove</span>
                            </div>
                        </div>
                    </Popup>
                </Polyline>
            )
        })

        return (
            <FeatureGroup>
                {lines}
            </FeatureGroup>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        multiPolylineDataSource: state.editStopReducer.multiPolylineDataSource,
        lastAddedCoordinate: state.editStopReducer.lastAddedCoordinate
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch
    }
}

const arrayOfPolylinesFromPolyline = (dataSourceItem) => {

    let arrayOfPolylines = []

    if (dataSourceItem.startPoint) {
        arrayOfPolylines.push(dataSourceItem.startPoint.coordinates)
    }

    if (dataSourceItem.inlinePositions.length) {
        dataSourceItem.inlinePositions.forEach((inlinePosition) => {
            arrayOfPolylines.push(inlinePosition)
        })
    }

    if (dataSourceItem.endPoint) {
        arrayOfPolylines.push(dataSourceItem.endPoint.coordinates)
    }

    return arrayOfPolylines
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MultiPolylineList)
