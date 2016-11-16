import React from 'react'
import {Polyline, Popup, LayersControl, FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'
import GenerateColor from './Colors'
import { UserActions } from '../actions'
import {LatLng} from 'leaflet'

class MultiPolylineList extends React.Component {

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.multiPolylineDataSource !== nextProps.multiPolylineDataSource)
    }

    handleRemovePolyline(index) {
        this.props.dispatch(UserActions.removePolylineFromIndex(index))
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

        let lines = multiPolylineDataSource.map( (positions, index) => {

            let color = GenerateColor(index)

            let latlngDistances = positions.map ( (position) => new LatLng(position[0], position[1]))
            let totalDistance = 0

            for (let i = 0; i < latlngDistances.length; i++) {
                if (latlngDistances[i+1] == null) break
                totalDistance += latlngDistances[i].distanceTo(latlngDistances[i+1])
            }

            return (
                <Polyline weight={10} key={'pl'+index} color={color} positions={positions}>
                    <Popup key={'pl'+index}>
                        <div>
                            <div style={{fontWeight:600, width: '100%', textAlign: 'center', margin: 0, color: color, display: 'inline-block'}}>Ganglenke {index+1}</div>
                            <div>
                                <span
                                    style={{width: '100%', textAlign: 'center', marginTop: '10', fontWeight: 600, display: 'inline-block'}}
                                >{parseFloat(totalDistance.toFixed(2))} m</span>
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
        multiPolylineDataSource: state.editStopReducer.arrayOfPolylines
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MultiPolylineList)
