import React from 'react'
import { connect }  from 'react-redux'
import { injectIntl } from 'react-intl'
import { StopPlaceActions } from '../actions'
import { setDecimalPrecision } from '../utils'
import ConfirmDialog from '../components/ConfirmDialog'

const entranceIcon = require("../static/icons/entrance-icon-2x.png")
const junctionIcon = require("../static/icons/junction-icon-2x.png")
const quayIcon = require("../static/icons/quay-marker.png")
const newStopIcon = require("../static/icons/new-stop-icon-2x.png")
const parkAndRideIcon = require("../static/icons/parking-icon.png")
const bikeParkingIcon = require("../static/icons/cycle-parking-icon.png")

class NewElementsBox extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      confirmDialogOpen: false
    }
  }

  handleDialogClose() {
    this.setState({
      confirmDialogOpen: false,
      owner: null
    })
  }

  handleConfirmSubmit() {
    const { owner } = this.state
    this.props.dispatch(StopPlaceActions.addElementToStop(owner.key, owner.latlng))
    this.handleDialogClose()
  }
  render() {

    const { formatMessage } = this.props.intl
    const { activeStopPlace, missingCoordsMap, disabled } = this.props

    const boxWrapperStyle = {
      width: 'auto',
      zIndex: 999,
      fontSize: 10,
      textAlign: 'center',
      position: 'fixed',
      width: 'auto',
      marginLeft: '41%',
      top: 5,
      color: '#fff'
    }

    const elementStyle = {
      display: 'inline-block',
      cursor: disabled ? 'not-allowed' : 'move',
      margin: '10 15'
    }

    const titleStyle = {
      textTransform: 'capitalize',
      marginTop: 5,
    }

    const quayText = formatMessage({id: 'quay'})
    const pathJunctionText = formatMessage({id: 'pathJunction'})
    const entranceText = formatMessage({id: 'entrance'})
    const newStopText = formatMessage({id: 'stop_place'})
    const parkAndRideText = formatMessage({id: 'park_ride'})
    const bikeParkingText = formatMessage({id: 'parking_bike'})

    let shouldShowNewStop = true

    if (activeStopPlace && ( activeStopPlace.location || missingCoordsMap[activeStopPlace.id]) ) {
      shouldShowNewStop = false
    }

    return (
      <div style={boxWrapperStyle}>
          <ConfirmDialog
            open={this.state.confirmDialogOpen}
            intl={this.props.intl}
            messagesById={{
              title: 'add_new_element_title',
              body: 'add_new_element_body',
              confirm: 'add_new_element_confirm',
              cancel: 'add_new_element_cancel',
            }}
            handleClose={this.handleDialogClose.bind(this)}
            handleConfirm={this.handleConfirmSubmit.bind(this)}
          />

          <div style={{marginTop: 0, marginBottom: 0}}>
            { shouldShowNewStop
              ?
              <div style={elementStyle}>
                <img ref="stop_place" id="stop_place" draggable style={{height: 25, width: 'auto', marginLeft: newStopText.length}} src={newStopIcon}/>
                <div style={titleStyle}>{newStopText}</div>
              </div>
              : null
            }
            <div style={elementStyle}>
              <img id="drag1" data-type="quay" ref="quay" draggable="true" style={{height: 25, width: 'auto', marginLeft: 0}} src={quayIcon}/>
              <div style={titleStyle}>{quayText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="pathJunction" data-type="pathJunction" id="drag2" draggable style={{height: 25, width: 'auto', marginLeft: 0}} src={junctionIcon}/>
              <div style={titleStyle}>{pathJunctionText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="entrance" data-type="entrance" id="drag3" draggable style={{height: 25, width: 'auto', marginLeft: 0}} src={entranceIcon}/>
              <div style={titleStyle}>{entranceText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="parkAndRide" data-type="parkAndRide" id="drag4" draggable style={{height: 25, width: 'auto', marginLeft: 0}} src={parkAndRideIcon}/>
              <div style={titleStyle}>{parkAndRideText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="bikeParking" data-type="bikeParking" id="drag5" draggable style={{height: 25, width: 'auto', marginLeft: 0}} src={bikeParkingIcon}/>
              <div style={titleStyle}>{bikeParkingText}</div>
            </div>
          </div>
      </div>
    )
  }

  componentWillUnmount() {
    // TODO: remove event listeners
  }

  componentDidMount() {
    if (!this.props.disabled) {
      Object.keys(this.refs).forEach( (key) => {

        const ref = this.refs[key]
        const type = ref.getAttribute('data-type')

        if (ref.draggable) {
          const draggable = new L.Draggable(ref)

          draggable.addEventListener('dragend', (event) => {
            // prevent adding to map if distance is too short (i.e. a mistake)
            if(event.distance < 50) {
              L.DomUtil.setPosition(ref, L.point(0,0))
              return
            }

            const { activeMap } = this.props
            const { target } = event
            const position = target._newPos
            const widthOffset = -12
            const heightOffset = -45

            const xPos = target._startPoint.x + position.x - target._startPos.x + widthOffset
            const yPos = target._startPoint.y + position.y - target._startPos.y + heightOffset

            const absolutePosition = new L.Point(xPos, yPos)

            const { lat,lng } = activeMap.containerPointToLatLng(absolutePosition)

            const latlng = [setDecimalPrecision(lat,6), setDecimalPrecision(lng,6)]

            this.setState({
              confirmDialogOpen: true,
              owner: {
                key: type,
                latlng: latlng,
              }
            })

            L.DomUtil.setPosition(ref, L.point(0,0))

          })
          draggable.enable()
        }
      })
    }
  }
}

const mapStateToProps = state => ({
  isMultiPolylinesEnabled: state.stopPlace.enablePolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  activeMap: state.mapUtils.activeMap,
  missingCoordsMap: state.user.missingCoordsMap,
  activeStopPlace: state.stopPlace.current
})

export default injectIntl(connect(mapStateToProps)(NewElementsBox))
