import React from 'react'
import { connect }  from 'react-redux'
import { injectIntl } from 'react-intl'
import L from 'leaflet'
import { MapActions } from '../actions'

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

        draggable.addEventListener('dragend', () => {
          const position = draggable._newPos
          const { activeMap } = this.props

          let layer = null

          // TODO : Consider using map instead of layer to calculate latlng
          Object.keys(activeMap._targets).forEach( (_target) => {
            if (activeMap._targets[_target]._controlContainer &&
              activeMap._targets[_target]._controlContainer.className == 'leaflet-control-container') {
              layer = activeMap._targets[_target]
            }
          })

          // TODO : Fix offset of coordinates
          const xPos = draggable._startPoint.x + position.x - draggable._startPos.x
          const yPos = draggable._startPoint.y + position.y - draggable._startPos.y

          const absolutePosition = new L.Point(xPos, yPos, true)

          const latlng = layer.layerPointToLatLng(absolutePosition)

          const userConfirmation = confirm('Do you want to add an entry here at ' + latlng + ' ?')

          if (userConfirmation) {
            this.handleAddElement(key, latlng)
          }

          let startPosition = L.point(0,0)

          L.DomUtil.setPosition(ref, startPosition)
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
