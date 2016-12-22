import React from 'react'
import { connect }  from 'react-redux'
import { injectIntl } from 'react-intl'
 import { MapActions } from '../actions'
import { setDecimalPrecision } from '../utils'

const entranceIcon = require("../static/icons/entrance-icon-2x.png")
const junctionIcon = require("../static/icons/junction-icon-2x.png")


class NewElementsBox extends React.Component {

  handleAddElement(type, latlng) {
    this.props.dispatch(MapActions.addJunctionElement(type, latlng))
  }

  render() {

    const { formatMessage } = this.props.intl

    const boxWrapperStyle = {
      background: '#fff',
      position: 'absolute',
      top: '82vh',
      margin: 20,
      width: 250,
      border: '1px solid #511e12',
      zIndex: 999,
      right: 0
    }

    const stopBoxBar = {
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontWeight: '0.9em',
      display: 'block',
      height: 25,
    }

    const elementStyle = {
      display: 'inline-block',
      cursor: 'move',
      margin: 10
    }

    return (
      <div style={boxWrapperStyle}>
          <div style={stopBoxBar}>
            <div style={{marginLeft: 5, paddingTop: 4, fontSize: '0.8em'}}>{formatMessage({id: 'new_elements'})}</div>
          </div>
          <div style={{display: 'block', marginTop: 0, marginBottom: 0}}>
            <div ref="entrance" id="drag1" draggable="true" style={elementStyle}>
              <img style={{height: 40, width: 'auto'}} src={entranceIcon}/>
            </div>
            <div ref="pathJunction" id="drag2" draggable="true" style={elementStyle}>
              <img style={{height: 40, width: 'auto'}} src={junctionIcon}/>
            </div>
          </div>
      </div>
    )
  }

  componentDidMount() {

    Object.keys(this.refs).forEach( (key) => {
      const ref = this.refs[key]

      if (ref.draggable) {
        const draggable = new L.Draggable(ref)

        draggable.addEventListener('dragend', (event) => {
          // prevent adding to map if distance is too short (i.e. a mistake)
          if(event.distance < 30) {
            L.DomUtil.setPosition(ref, L.point(0,0))
            return
          }

          const { activeMap } = this.props
          const { formatMessage } = this.props.intl
          const { target } = event
          const position = target._newPos
          const widthOffset = -12
          const heightOffset = -45

          const xPos = target._startPoint.x + position.x - target._startPos.x + widthOffset
          const yPos = target._startPoint.y + position.y - target._startPos.y + heightOffset

          const absolutePosition = new L.Point(xPos, yPos)

          const { lat,lng } = activeMap.containerPointToLatLng(absolutePosition)

          const latlng = {
            lat: setDecimalPrecision(lat,6),
            lng: setDecimalPrecision(lng,6)
          }

          const addEntryMessage = `${formatMessage({id: 'add_entry_message'})} ${formatMessage({id: key})} ${formatMessage({id: 'at'})} `

          const userConfirmation = confirm(`${addEntryMessage} ${latlng.lat},${latlng.lng}?`)

          if (userConfirmation) {
            this.handleAddElement(key, latlng)
          }
          L.DomUtil.setPosition(ref, L.point(0,0))
        })
        draggable.enable()
      }
    })
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    isMultiPolylinesEnabled: state.editStopReducer.enablePolylines,
    isCompassBearingEnabled: state.editStopReducer.isCompassBearingEnabled,
    activeMap: state.editStopReducer.activeMap
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NewElementsBox))
