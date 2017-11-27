/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOM from 'react-dom/server';
import CustomMarkerIcon from './CustomMarkerIcon';
import { shallowCompareStopPlaceMarker as shallowCompare } from './shallowCompare/';
import PopupButton from '../Map/PopupButton';

class StopPlaceMarker extends React.Component {
  static propTypes = {
    position: PropTypes.arrayOf(Number),
    handleDragEnd: PropTypes.func.isRequired,
    handleOnClick: PropTypes.func.isRequired,
    handleChangeCoordinates: PropTypes.func,
    stopType: PropTypes.string,
    index: PropTypes.number.isRequired,
    draggable: PropTypes.bool.isRequired,
    translations: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    id: PropTypes.string,
    isEditingStop: PropTypes.bool.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this.props, nextProps);
  }

  componentWillMount() {
    this.createIcon(this.props);
  }

  componentWillUpdate(nextProps) {
    this.createIcon(nextProps);
  }

  createIcon({
    index,
    stopType,
    submode,
    active,
    isMultimodal,
    isMultimodalChild,
    hasExpired
  }) {
    let divIconBody = (
      <CustomMarkerIcon
        markerIndex={index}
        isMultimodal={isMultimodal}
        isMultimodalChild={isMultimodalChild}
        stopType={stopType}
        active={active}
        submode={submode}
        hasExpired={hasExpired}
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
      isMultimodal,
      id,
      disabled,
      disabledForSearch,
      hasExpired,
      isEditingGroup,
      handleCreateGroup,
      isGroupMember
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
        zIndexOffset={isMultimodal ? 150 : 100}
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
            <PopupButton
              hidden={disabled || !draggable}
              onClick={handleAdjustCentroid}
              label={translations.adjustCentroid}
            />
            <PopupButton
              hidden={isMultimodalChild || isGroupMember}
              onClick={() => {
                handleCreateGroup(id)
              }}
              label={translations.createGOS}
            />
            <PopupButton
              hidden={!isMultimodalChild}
              onClick={() =>
                isShowingQuays ? handleHideQuays(id) : handleShowQuays(id)}
              label={
                isShowingQuays ? translations.hideQuays : translations.showQuays
              }
            />
            <PopupButton
              hidden={!isEditingGroup || !isGroupMember}
              labelStyle={{background: 'rgb(152,51,47)'}}
              onClick={() => this.props.removeFromGroup(id)}
              label={translations.removeFromGroup}
            />
            <PopupButton
              hidden={isMultimodalChild || isMultimodal || disabledForSearch || hasExpired}
              onClick={() => this.props.createNewMultimodalStopFrom(id)}
              label={translations.createMultimodal}
            />
          </div>
        </Popup>
      </Marker>
    );
  }
}

export default StopPlaceMarker;
