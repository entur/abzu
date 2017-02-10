import React, { PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import CustomMarkerIcon from './CustomMarkerIcon'

class StopPlaceMarker extends React.PureComponent {

  static propTypes = {
    position: PropTypes.arrayOf(Number).isRequired,
    handleDragEnd: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleChangeCoordinates: PropTypes.func,
    name: PropTypes.string.isRequired,
    stopType: PropTypes.string,
    index: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    translations: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    handleHideQuaysForNeighbourStop: PropTypes.func,
    neighbouringMarkersQuaysMap: PropTypes.object.isRequired,
    isEditingStop: PropTypes.bool.isRequired
  }

  handleToggleQuaysForNeighbouringStop(isShowingQuays) {
    const { id } = this.props

    if (isShowingQuays) {
      this.props.handleHideQuaysForNeighbourStop(id)
    } else {
      this.props.handleFetchQuaysForNeighbourStop(id)
    }
  }

  render() {

    const { position, handleOnClick, handleDragEnd, index, draggable,
          handleChangeCoordinates, translations, active, stopType, id, neighbouringMarkersQuaysMap } = this.props

    const name = this.props.name ? this.props.name : translations.untitled

    let divIconBody = (
      <CustomMarkerIcon
        markerIndex={index}
        stopType={stopType}
        active={active}
        />
    )

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(divIconBody)

    let icon = divIcon({html: divIconBodyMarkup, iconAnchor: [45,92], popupAnchor: [0,-2]})

    const isShowingQuays = !!neighbouringMarkersQuaysMap.get(id) && neighbouringMarkersQuaysMap.get(id).length

    return (

      <Marker
        key={"stop-place" + id}
        icon={icon}
        position={position}
        onDragend={(event) => { handleDragEnd(false, index, event) }}
        draggable={draggable && active}
        >
        <Popup autoPan={false}>
          <div>
            <span style={{fontWeight: 600, color: '#00bcd4', fontSize: '1.2em', cursor: 'pointer',
              marginBottom: 10, display: 'inline-block', width: '100%', textAlign: 'center', marginBottom: 15, borderBottom: !active ? '1px dotted' : 'none'
            }}
            onClick={handleOnClick}
            >
              { name }
            </span>
            <div
              style={{display: 'block', cursor: 'pointer', width: 'auto', textAlign: 'center'}}
              onClick={() => handleChangeCoordinates && handleChangeCoordinates(false, index, position)}
              >
              <span style={{display: 'inline-block', textAlign: 'center', borderBottom: '1px dotted black', }}>
                {position[0]}
              </span>
              <span style={{display: 'inline-block', marginLeft: 3, borderBottom: '1px dotted black'}}>
                {position[1]}
              </span>
            </div>
            <div style={{display: 'block', width: '100%'}}>
              { !active && this.props.isEditingStop
                ?
                  <div style={{textAlign: 'center', margin: 10, cursor: 'pointer'}}
                    onClick={(event) => this.handleToggleQuaysForNeighbouringStop(isShowingQuays)}>
                    + { isShowingQuays ? translations.hideQuays : translations.showQuays }
                  </div>
                : null
              }
            </div>
          </div>
        </Popup>
      </Marker>
    )
  }
}

export default StopPlaceMarker
