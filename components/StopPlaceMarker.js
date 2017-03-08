import React, { PropTypes } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L, { divIcon } from 'leaflet'
import ReactDOM from 'react-dom/server'
import CustomMarkerIcon from './CustomMarkerIcon'

class StopPlaceMarker extends React.PureComponent {

  static propTypes = {
    position: PropTypes.arrayOf(Number),
    handleDragEnd: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleChangeCoordinates: PropTypes.func,
    name: PropTypes.string.isRequired,
    stopType: PropTypes.string,
    index: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    translations: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    id: PropTypes.string,
    handleHideQuaysForNeighbourStop: PropTypes.func,
    isShowingQuays: PropTypes.bool.isRequired,
    isEditingStop: PropTypes.bool.isRequired
  }

  render() {

    const { position, handleOnClick, handleDragEnd, index, draggable, missingCoordinatesMap,
          handleChangeCoordinates, translations, active, stopType, id, handleFetchQuaysForNeighbourStop, handleHideQuaysForNeighbourStop, isShowingQuays } = this.props

    const markerLocation = position || missingCoordinatesMap[id]

    if (!markerLocation) return null

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

    return (

      <Marker
        key={"stop-place" + id}
        icon={icon}
        position={markerLocation}
        onDragend={ event => { handleDragEnd(false, index, event) }}
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
              onClick={() => handleChangeCoordinates && handleChangeCoordinates(false, index, markerLocation)}
              >
              <span style={{display: 'inline-block', textAlign: 'center', borderBottom: '1px dotted black', }}>
                {markerLocation[0]}
              </span>
              <span style={{display: 'inline-block', marginLeft: 3, borderBottom: '1px dotted black'}}>
                {markerLocation[1]}
              </span>
            </div>
            { active
              ? null
              : isShowingQuays ?
                <div
                  style={{marginTop: 10, cursor: 'pointer', textAlign: 'center'}}
                  onClick={() => handleHideQuaysForNeighbourStop(id)}
                >
                  <span style={{borderBottom: '1px dotted black'}}> { translations.hideQuays } </span>
               </div>
              : <div
                  style={{marginTop: 10, cursor: 'pointer', textAlign: 'center'}}
                  onClick={() => handleFetchQuaysForNeighbourStop(id)}
                >
                  <span style={{borderBottom: '1px dotted black'}}> { translations.showQuays }</span>
                </div>
            }
          </div>
        </Popup>
      </Marker>
    )
  }
}

export default StopPlaceMarker
