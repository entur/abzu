import React from 'react'
import {Polyline, Popup, LayersControl, FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'
import GenerateColor from './Colors'
import { UserActions } from '../actions'


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

            let lines = multiPolylineDataSource.map( (position, index) => {
                let color = GenerateColor(index)
                return <Polyline weight={10} key={'pl'+index} color={color} positions={position}>
                        <Popup key={'pl'+index}>
                            <div>
                                <div style={{fontWeight:600, width: 80, textAlign: 'center', margin: 0, color: color}}>Ganglenke {index+1}</div>
                                <div onClick={() => this.handleRemovePolyline(index)}>
                                    <span
                                        style={polylinePopupStyle}
                                    >Remove</span>
                                </div>
                            </div>
                        </Popup>
                    </Polyline>
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
