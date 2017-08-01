import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOM from 'react-dom/server';
import CustomMarkerIcon from './CustomMarkerIcon';
import { shallowCompareNeighbourMarker as shallowCompare } from './shallowCompare/';

class NeighbourMarker extends React.Component {
  static propTypes = {
    position: PropTypes.arrayOf(Number),
    handleOnClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    stopType: PropTypes.string,
    index: PropTypes.number.isRequired,
    translations: PropTypes.object.isRequired,
    id: PropTypes.string,
    handleHideQuaysForNeighbourStop: PropTypes.func,
    isShowingQuays: PropTypes.bool.isRequired,
    isEditingStop: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }

  render() {
    const {
      position,
      handleOnClick,
      index,
      name,
      stopType,
      translations,
      id,
      handleShowQuays,
      handleHideQuays,
      isEditingStop,
      isShowingQuays,
      disabled,
      handleMergeStopPlace,
      hasExpired,
      submode
    } = this.props;

    if (!position) return null;

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(
      <CustomMarkerIcon
        markerIndex={index}
        stopType={stopType}
        submode={submode}
        hasExpired={hasExpired}
        active={false}
      />
    );

    let icon = divIcon({
      html: divIconBodyMarkup,
      iconAnchor: [10, 20],
      iconSize: [20, 20],
      popupAnchor: [5, 17]
    });

    let titleStyle = {
      fontWeight: 600,
      color: '#41c0c4',
      fontSize: '1.2em',
      borderBottom: '1px dotted',
      cursor: 'pointer'
    };

    return (
      <Marker
        key={'neighbour-stop' + id}
        keyboard={false}
        icon={icon}
        position={position}
        draggable={false}
      >
        <Popup autoPan={false}>
          <div>
            <div
              style={{
                marginBottom: 10,
                display: 'inline-block',
                width: '100%',
                marginBottom: 15,
                textAlign: 'center'
              }}
              onClick={handleOnClick}
            >
              <div style={{ display: 'inline-block' }}>
                <div>
                  <span style={titleStyle}>{name || id}</span>
                  {hasExpired &&
                    <div
                      style={{
                        marginTop: 4,
                        fontWeight: 600,
                        padding: '0px 5px',
                        color: '#fff',
                        background: 'rgb(187, 39, 28)'
                      }}
                    >
                      {translations.expired}
                    </div>}
                </div>
              </div>
            </div>
            <div
              style={{ display: 'block', width: 'auto', textAlign: 'center' }}
            >
              <span style={{ display: 'inline-block', textAlign: 'center' }}>
                {position[0]}
              </span>
              <span style={{ display: 'inline-block', marginLeft: 3 }}>
                {position[1]}
              </span>
            </div>
            {!disabled &&
              isEditingStop &&
              <div
                style={{
                  marginTop: 10,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => handleMergeStopPlace(id, name)}
              >
                <span className="marker-popup-button">
                  {translations.mergeStopPlace}
                </span>
              </div>}
            {isShowingQuays
              ? <div
                style={{
                  marginTop: 10,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => handleHideQuays(id)}
              >
                <span className="marker-popup-button">
                    {translations.hideQuays}
                  </span>
              </div>
              : <div
                style={{
                  marginTop: 10,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
                onClick={() => handleShowQuays(id)}
              >
                  <span className="marker-popup-button">
                    {translations.showQuays}
                  </span>
              </div>}
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default NeighbourMarker;
