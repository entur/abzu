import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOM from 'react-dom/server';
import CustomMarkerIcon from './CustomMarkerIcon';
import { shallowCompareStopPlaceMarker as shallowCompare } from './shallowCompare/';

class StopPlaceMarker extends React.Component {
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
    isEditingStop: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }

  componentWillMount() {
    const { props } = this;
    this.createIcon(props);
  }

  componentWillUpdate(nextProps) {
    this.createIcon(nextProps);
  }

  createIcon({index, stopType, submode, active, isMultimodal, isMultimodalChild}) {
    let divIconBody = (
      <CustomMarkerIcon
        markerIndex={index}
        isMultimodal={isMultimodal}
        isMultimodalChild={isMultimodalChild}
        stopType={stopType}
        active={active}
        submode={submode}
      />
    );

    let divIconBodyMarkup = ReactDOM.renderToStaticMarkup(divIconBody);

    this._icon = divIcon({
      html: divIconBodyMarkup,
      iconAnchor: [10, 20],
      iconSize: [20, 20],
      popupAnchor: [0, 17]
    });
  }

  render() {
    const {
      position,
      handleOnClick,
      handleDragEnd,
      index,
      draggable,
      missingCoordinatesMap,
      handleChangeCoordinates,
      handleAdjustCentroid,
      translations,
      isShowingQuays,
      handleShowQuays,
      handleHideQuays,
      isMultimodalChild,
      id,
      disabled
    } = this.props;

    const markerLocation = position || missingCoordinatesMap[id];

    if (!markerLocation) return null;

    const name = this.props.name ? this.props.name : translations.untitled;

    const icon = this._icon;

    return (
      <Marker
        key={'stop-place' + id}
        keyboard={false}
        icon={icon}
        position={markerLocation}
        zIndexOffset={100}
        onDragend={event => {
          handleDragEnd(false, index, event);
        }}
        draggable={draggable}
      >
        <Popup autoPan={false}>
          <div>
            <div
              style={{
                fontWeight: 600,
                color: '#41c0c4',
                fontSize: '1.2em',
                cursor: 'pointer',
                marginBottom: 10,
                display: 'inline-block',
                width: '100%',
                marginBottom: 15,
                textAlign: 'center'
              }}
              onClick={handleOnClick}
            >
              <div style={{ display: 'inline-block' }}>{name}</div>
            </div>
            <div
              style={{
                display: 'block',
                cursor: 'pointer',
                width: 'auto',
                textAlign: 'center'
              }}
              onClick={() =>
                handleChangeCoordinates &&
                handleChangeCoordinates(false, index, markerLocation)}
            >
              <span
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  borderBottom: '1px dotted black'
                }}
              >
                {markerLocation[0]}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 3,
                  borderBottom: '1px dotted black'
                }}
              >
                {markerLocation[1]}
              </span>
            </div>
            {(!disabled && draggable) &&
              <div
                className={'marker-popup-button'}
                style={{ marginTop: 10 }}
                onClick={handleAdjustCentroid}
              >
                {translations.adjustCentroid}
              </div>}
            {isMultimodalChild &&
            <div
              className={'marker-popup-button'}
              style={{ marginTop: 10 }}
              onClick={() => isShowingQuays ? handleHideQuays(id) : handleShowQuays(id)}
            >
              {isShowingQuays ? translations.hideQuays : translations.showQuays}
            </div>}
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default StopPlaceMarker;
