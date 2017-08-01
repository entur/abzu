const markerIcon = require('../../static/icons/quay-marker-background.png');
import React from 'react';
import PropTypes from 'prop-types';
import { Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import ReactDOM from 'react-dom/server';
import { connect } from 'react-redux';
import compassIcon from '../../static/icons/compass.png';
import compassBearingIcon from '../../static/icons/compass-bearing.png';
import { UserActions, StopPlaceActions } from '../../actions/';
import OSMIcon from '../../static/icons/osm_logo.png';
import { getIn } from '../../utils/';
import ToolTippable from '../EditStopPage/ToolTippable';
import Code from '../EditStopPage/Code';

class QuayMarker extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    id: PropTypes.string,
    parentId: PropTypes.number.isRequired,
    parentStopPlaceName: PropTypes.string.isRequired,
    position: PropTypes.arrayOf(Number),
    publicCode: PropTypes.string.isRequired,
    privateCode: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    handleQuayDragEnd: PropTypes.func.isRequired,
    formattedStopType: PropTypes.string.isRequired,
    handleUpdatePathLink: PropTypes.func.isRequired,
    isCreatingPolylines: PropTypes.bool.isRequired,
    handleChangeCoordinates: PropTypes.func,
    draggable: PropTypes.bool.isRequired,
    handleSetCompassBearing: PropTypes.func
  };

  getOSMURL() {
    const { position } = this.props;
    return `https://www.openstreetmap.org/edit#map=18/${position[0]}/${position[1]}`;
  }

  handleMergeFrom() {
    const { id, dispatch } = this.props;
    dispatch(UserActions.startMergingQuayFrom(id));
  }

  handleMergeTo() {
    const { id, dispatch } = this.props;
    dispatch(UserActions.endMergingQuayTo(id));
  }

  handleCancelMerge() {
    this.props.dispatch(UserActions.cancelMergingQuayFrom());
  }

  handleSetFocus() {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.setElementFocus(index, 'quay'));
    document.querySelector(".quay-item-expanded").scrollIntoView(true);
    document.querySelector("#scroll-body").scrollTop -= 50;
  }

  handleMoveQuay() {
    this.props.dispatch(UserActions.moveQuay({
      id: this.props.id,
      privateCode: this.props.privateCode,
      publicCode: this.props.publicCode
    }));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.position !== nextProps.position) {
      return true;
    }

    if (this.props.publicCode !== nextProps.publicCode) {
      return true;
    }

    if (this.props.privateCode !== nextProps.privateCode) {
      return true;
    }

    if (this.props.index !== nextProps.index) {
      return true;
    }

    if (this.props.focusedElement !== nextProps.focusedElement) {
      return true;
    }

    if (
      this.props.belongsToNeighbourStop !== nextProps.belongsToNeighbourStop
    ) {
      return true;
    }

    if (this.props.compassBearing !== nextProps.compassBearing) {
      return true;
    }

    if (
      this.props.isCompassBearingEnabled !== nextProps.isCompassBearingEnabled
    ) {
      return true;
    }

    if (this.props.formattedStopType !== nextProps.formattedStopType) {
      return true;
    }

    if (this.props.isCreatingPolylines !== nextProps.isCreatingPolylines) {
      return true;
    }

    if (this.props.id !== nextProps.id) {
      return true;
    }

    if (this.props.pathLink !== nextProps.pathLink) {
      return true;
    }

    if (this.props.mergingQuay !== nextProps.mergingQuay) {
      return true;
    }

    return false;
  }

  render() {
    const {
      position,
      privateCode,
      publicCode,
      index,
      handleQuayDragEnd,
      parentStopPlaceName,
      formattedStopType,
      handleUpdatePathLink,
      translations,
      handleChangeCoordinates,
      belongsToNeighbourStop,
      isEditingStop,
      currentIsNewStop,
      isCreatingPolylines,
      id,
      pathLink,
      showPathLink,
      disabled,
      mergingQuay
    } = this.props;

    if (!position) return null;

    let isIncomplete = false;

    let pathLinkText = isCreatingPolylines
      ? translations.terminatePathLinkHere
      : translations.createPathLinkHere;

    if (isCreatingPolylines && pathLink && pathLink.length) {
      let lastPathLink = pathLink[pathLink.length - 1];
      let fromId = getIn(
        lastPathLink,
        ['from', 'placeRef', 'addressablePlace', 'id'],
        null
      );

      if (fromId === id) {
        pathLinkText = translations.cancelPathLink;
      } else {
        // LineString should either have 0 or >= 2 [long,lat] according to GeoJSON spec
        if (lastPathLink.inBetween && lastPathLink.inBetween.length == 1) {
          isIncomplete = true;
        }
      }
    }

    const divBody = ReactDOM.renderToStaticMarkup(
      <QuayMarkerIcon
        isEditingStop={isEditingStop}
        index={index}
        publicCode={publicCode}
        privateCode={privateCode}
        focusedElement={this.props.focusedElement}
        compassBearing={this.props.compassBearing}
        isCompassBearingEnabled={this.props.isCompassBearingEnabled}
        belongsToNeighbourStop={belongsToNeighbourStop}
      />
    );

    let quayIcon = divIcon({
      html: divBody,
      iconSize: [22, 35],
      iconAnchor: [11, 35],
      popupAnchor: [5, 0]
    });

    const osmURL = this.getOSMURL();
    const shouldShowMergeQuay =
      isEditingStop && !disabled && !belongsToNeighbourStop && !!id && !currentIsNewStop;
    const isMergingFromThis =
      id && mergingQuay.fromQuay && mergingQuay.fromQuay.id && id === mergingQuay.fromQuay.id;
    const shouldShowMoveQuay =
      isEditingStop && !disabled && belongsToNeighbourStop && !!id && !currentIsNewStop;

    return (
      <Marker
        position={position}
        icon={quayIcon}
        draggable={this.props.draggable}
        onDragend={event => {
          handleQuayDragEnd(index, 'quay', event);
        }}
        keyboard={false}
      >
        <Popup autoPan={false} onOpen={() => { this.handleSetFocus() }}>
          <div>
            <span className="quay-marker-title">
              {parentStopPlaceName}
            </span>
            <div
              className="quay-marker-title"
              style={{
                marginTop: -2,
                marginBottom: 5,
                fontSize: '1em',
                color: '#191919',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div>{formattedStopType}</div>
              <ToolTippable toolTipText={translations.publicCode}>
                <Code type="publicCode" value={publicCode}/>
              </ToolTippable>
              <ToolTippable toolTipText={translations.privateCode}>
                <Code type="privateCode" value={privateCode}/>
              </ToolTippable>
            </div>
            <div
              style={{
                display: 'block',
                cursor: 'pointer',
                width: 'auto',
                textAlign: 'center',
                fontSize: 10
              }}
              onClick={() =>
                !belongsToNeighbourStop &&
                handleChangeCoordinates(true, index, position)}
            >
              <span
                style={{
                  display: 'inline-block',
                  textAlign: 'center',
                  borderBottom: !belongsToNeighbourStop
                    ? '1px dotted black'
                    : 'none'
                }}
              >
                {position[0]}
              </span>
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: 3,
                  borderBottom: !belongsToNeighbourStop
                    ? '1px dotted black'
                    : 'none'
                }}
              >
                {position[1]}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 10
              }}
            >
              {belongsToNeighbourStop || !this.props.draggable
                ? null
                : <div
                    onClick={() => {
                      this.props.handleSetCompassBearing(
                        this.props.compassBearing,
                        index
                      );
                    }}
                  >
                    <img
                      style={{ width: 20, height: 22, cursor: 'pointer' }}
                      src={compassIcon}
                    />
                  </div>}
              <div
                style={{
                  marginLeft: belongsToNeighbourStop ? 0 : 10,
                  cursor: 'pointer'
                }}
              >
                <a href={osmURL} target="_blank">
                  <img
                    style={{
                      width: 20,
                      height: 22,
                      border: '1px solid grey',
                      borderRadius: 50
                    }}
                    src={OSMIcon}
                  />
                </a>
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {shouldShowMoveQuay &&
                <div style={{ textAlign: 'center' }}>
                  <span
                    className="marker-popup-button"
                    onClick={() => this.handleMoveQuay()}
                  >
                    {translations.moveQuayToCurrent}
                  </span>
                </div>}

              {shouldShowMergeQuay &&
                <div style={{ textAlign: 'center' }}>
                  {mergingQuay.isMerging
                    ? <div>
                        {isMergingFromThis
                          ? <span
                              className="marker-popup-button"
                              onClick={() => this.handleCancelMerge()}
                            >
                              {translations.mergeQuayCancel}
                            </span>
                          : <span
                              className="marker-popup-button"
                              onClick={() => this.handleMergeTo()}
                            >
                              {translations.mergeQuayTo}
                            </span>}
                      </div>
                    : <div>
                        <span
                          className="marker-popup-button"
                          onClick={() => this.handleMergeFrom()}
                        >
                          {translations.mergeQuayFrom}
                        </span>
                      </div>}
                </div>}
            </div>
            <div style={{ marginTop: 10 }}>
              {showPathLink && isEditingStop && !currentIsNewStop
                ? <div>
                  {id
                    ? <div
                      className={`marker-popup-button ${isIncomplete
                        ? 'incomplete'
                        : ''}`}
                      onClick={() => {
                        handleUpdatePathLink(position, id, 'quay');
                      }}
                    >
                      {pathLinkText}
                      {isIncomplete && <div>{translations.inComplete}</div>}
                      </div>
                    : <div
                      style={{
                        textAlign: 'center',
                        padding: 10,
                        border: '1px solid #9E9E9E'
                      }}
                    >
                      {translations.saveFirstPathLink}
                    </div>}
                </div>
                : null}
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

class QuayMarkerIcon extends React.PureComponent {
  componentWillMount() {
    const {
      focusedElement,
      index,
      belongsToNeighbourStop,
      compassBearing
    } = this.props;

    let markerIconStyle = { transform: 'scale(0.7)' };

    if (belongsToNeighbourStop) {
      markerIconStyle.filter = 'grayscale(100%)';
      markerIconStyle.opacity = '0.8';
    }

    this._shouldBeFocused =
      focusedElement.type === 'quay' && index === focusedElement.index;
    this._markerIcon = (
      <img
        src={markerIcon}
        style={markerIconStyle}
        className={this._shouldBeFocused ? 'focused' : ''}
      />
    );
    this._compassBearingIcon = (
      <img
        style={{
          width: 20,
          height: 20,
          marginLeft: 6,
          position: 'absolute',
          marginTop: -12,
          transform: `rotate(${compassBearing}deg) scale(0.7)`
        }}
        src={compassBearingIcon}
      />
    );
  }

  render() {
    const { publicCode, compassBearing, isCompassBearingEnabled } = this.props;
    const quayShortName = getShortQuayName(publicCode);

    const quayStyle = {
      color: '#fff',
      position: 'absolute',
      top: 12,
      left: 1,
      zIndex: 9999,
    };

    return (
      <div>
        {isCompassBearingEnabled && compassBearing
          ? this._compassBearingIcon
          : null}
        {this._markerIcon}
        <div style={quayStyle}>
          <div style={{
            width: 30,
            fontSize: quayShortName ? 12 : 10,
            textAlign: 'center'
          }}>{quayShortName || 'N/A'}</div>
          </div>
      </div>
    );
  }
}

const getShortQuayName = quayName => {
  if (!isNaN(quayName)) return quayName;
  return quayName.length > 1 ? quayName.substring(0, 1) : quayName;
};

const mapStateToProps = state => ({
  isCreatingPolylines: state.stopPlace.isCreatingPolylines,
  isCompassBearingEnabled: state.stopPlace.isCompassBearingEnabled,
  focusedElement: state.mapUtils.focusedElement,
  mergingQuay: state.mapUtils.mergingQuay,
  pathLink: state.stopPlace.pathLink,
});

export default connect(mapStateToProps)(QuayMarker);
