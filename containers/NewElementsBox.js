import React from 'react'
import { connect }  from 'react-redux'
import { injectIntl } from 'react-intl'
import { MapActions } from '../actions'
import { setDecimalPrecision } from '../utils'

const entranceIcon = require("../static/icons/entrance-icon-2x.png")
const junctionIcon = require("../static/icons/junction-icon-2x.png")
const quayIcon = require("../static/icons/quay-marker.png")

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
      width: 'auto',
      border: '1px solid #511e12',
      zIndex: 999,
      right: 0,
      cursor: 'move'
    }

    const stopBoxBar = {
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontWeight: '0.9em',
      display: 'block',
      height: 25
    }

    const elementStyle = {
      display: 'inline-block',
      cursor: 'move',
      margin: '10 15'
    }

    const titleStyle = {
      fontWeight: 600,
      fontSize: '0.8em',
      textTransform: 'capitalize',
      marginTop: 8,
      marginBottom: -10
    }

    const quayText = formatMessage({id: 'quay'})
    const pathJunctionText = formatMessage({id: 'pathJunction'})
    const entranceText = formatMessage({id: 'entrance'})

    return (
      <div ref='newElementsContainer' style={boxWrapperStyle}>
          <div style={stopBoxBar}>
            <div style={{textIndent: 5, paddingTop: 4, fontSize: '0.8em'}}>{formatMessage({id: 'new_elements'})}</div>
          </div>
          <div style={{display: 'block', marginTop: 0, marginBottom: 0}}>
            <div style={elementStyle}>
              <img id="drag1" ref="quay" draggable="true" style={{height: 40, width: 'auto', marginLeft: quayText.length}} src={quayIcon}/>
              <div style={titleStyle}>{quayText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="entrance" id="drag2" draggable="true" style={{height: 40, width: 'auto', marginLeft: pathJunctionText.length*2}} src={entranceIcon}/>
              <div style={titleStyle}>{pathJunctionText}</div>
            </div>
            <div style={elementStyle}>
              <img ref="pathJunction" id="drag3" draggable="true" style={{height: 40, width: 'auto', marginLeft: entranceText.length*1.5}} src={junctionIcon}/>
              <div style={titleStyle}>{entranceText}</div>
            </div>
          </div>
      </div>
    )
  }

  componentDidMount() {

    new L.Draggable(this.refs.newElementsContainer).enable()

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
