import React from 'react'
import {Polyline, Popup, LayersControl, FeatureGroup} from 'react-leaflet'
import {connect} from 'react-redux'

class MultiPolylineList extends React.Component {

        shouldComponentUpdate(nextProps, nextState) {
            return (this.props.multiPolylineDataSource !== nextProps.multiPolylineDataSource)
        }

        render() {

            const { multiPolylineDataSource } = this.props

            let lines = multiPolylineDataSource.map( (position, index) => {
                return <Polyline key={'pl'+index} color='purple' positions={position}>
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
