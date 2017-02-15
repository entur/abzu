import React from 'react'
import { Polyline, Popup, FeatureGroup } from 'react-leaflet'
import { connect } from 'react-redux'
import GenerateColor from './Colors'
import { UserActions } from '../actions'
import { injectIntl } from 'react-intl'
import WalkingDistanceDialog from './WalkingDistanceDialog'

class MultiPolylineList extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      openDialog: false
    }
  }

  handleRemovePolyline(index) {
    this.props.dispatch(UserActions.removePolylineFromIndex(index))
  }

  handleEditTimeEstimate(index, estimate) {
    if (estimate && !isNaN(estimate)) {
      this.props.dispatch(UserActions.editPolylineTimeEstimate(index, parseInt(estimate)))
    }

    this.handleCloseDialog()
  }

  handleCloseDialog() {
    this.setState({
      openDialog: false
    })
  }

  render() {

    const { multiPolylineDataSource, intl } = this.props
    const { openDialog } = this.state
    const { formatMessage } = intl

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

      let color = GenerateColor(index)

      let isCompleted = polyline.endQuay

      let position = arrayOfPolylinesFromPolyline(polyline)

      return (
        <Polyline weight={6} key={'pl'+index} color={color} positions={position} opacity={isCompleted ? 0.8 : 1.0} dashArray="8,14" lineJoin='round'>
          <WalkingDistanceDialog
            open={openDialog} intl={intl}
            handleConfirm={this.handleEditTimeEstimate.bind(this)}
            handleClose={this.handleCloseDialog.bind(this)}
            estimate={polyline.estimate}
            index={index}
          />
          <Popup key={'pl'+index}>
            <div>
              <div style={{fontWeight:600, width: '100%', textAlign: 'center', margin: 0, color: color, display: 'inline-block'}}>Ganglenke {index+1}</div>
              <div>
                { polyline.distance
                  ?
                  <span
                    style={{width: '100%', textAlign: 'center', marginTop: 10, fontWeight: 600, display: 'inline-block'}}
                  > { parseFloat(polyline.distance.toFixed(2)) } m</span>
                  : null
                }
                <span
                  style={polylinePopupStyle}
                  onClick={() => this.setState({openDialog: true})}
                >

                  { formatMessage({id: 'estimated_time'}, {
                      estimate: polyline.estimate,
                      minuteCount: Number(polyline.estimate),
                      minute: formatMessage({id: 'minute'}),
                      minutes: formatMessage({id: 'minutes'})
                  }) }

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



const mapStateToProps = state => ({
  multiPolylineDataSource: state.editingStop.multiPolylineDataSource,
  lastAddedCoordinate: state.editingStop.lastAddedCoordinate
})

export default injectIntl(connect(mapStateToProps)(MultiPolylineList))
