import React, { PropTypes } from 'react';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOM from 'react-dom/server';
import CustomMarkerIcon from './CustomMarkerIcon';

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
    if (
      JSON.stringify(this.props.position) !== JSON.stringify(nextProps.position)
    ) {
      return true;
    }

    if (this.props.stopType !== nextProps.stopType) {
      return true;
    }

    if (this.props.id !== nextProps.id) {
      return true;
    }

    if (this.props.isShowingQuays !== nextProps.isShowingQuays) {
      return true;
    }

    if (this.props.name !== nextProps.name) {
      return true;
    }

    if (this.props.hasExpired !== nextProps.hasExpired) {
      return true;
    }

    return false;
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
      hasExpired
    } = this.props;

    if (!position) return null;

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(
      <CustomMarkerIcon
        markerIndex={index}
        stopType={stopType}
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
            {isShowingQuays
              ? <div
                  style={{
                    marginTop: 10,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                  onClick={() => handleHideQuays(id)}
                >
                  <span style={{ borderBottom: '1px dotted black' }}>
                    {' '}{translations.hideQuays}
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
                  <span style={{ borderBottom: '1px dotted black' }}>
                    {' '}{translations.showQuays}
                  </span>
                </div>}
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
                <span style={{ borderBottom: '1px dotted black' }}>
                  {' '}{translations.mergeStopPlace}
                  {' '}
                </span>
              </div>}
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default NeighbourMarker;
