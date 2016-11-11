import React from 'react'
import {MultiPolyline, Popup} from 'react-leaflet'
import {connect} from 'react-redux'

class MultiPolylineList extends React.Component {

    render() {

        const { multiPolylineDataSource } = this.props

        return (
            <MultiPolyline color='purple' polylines={multiPolylineDataSource} />
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        multiPolylineDataSource: state.editStopReducer.multiPolylineDataSource || []
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
