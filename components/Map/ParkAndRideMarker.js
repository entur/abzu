import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import PropTypes from 'prop-types';
import L, { divIcon } from 'leaflet';
import ParkingIcon from '../../static/icons/parking-icon.png';
import { connect } from 'react-redux';
import { enturPrimaryDarker } from '../../config/enturTheme';
import { StopPlaceActions } from '../../actions/';
import { shallowCompareParkNRide as shallowCompare } from './shallowCompare/';

class ParkingAndRideMarker extends React.Component {
  static propTypes = {
    position: PropTypes.arrayOf(PropTypes.number),
    index: PropTypes.number.isRequired,
    handleDragEnd: PropTypes.func.isRequired,
    hasExpired: PropTypes.bool.isRequired,
    translations: PropTypes.shape({
      title: PropTypes.string.isRequired,
      totalCapacity: PropTypes.string.isRequired,
      totalCapacityUnknown: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentDidUpdate() {
    const { focusedElement, index, type } = this.props;
    const isFocused =
      focusedElement.type === type && index === focusedElement.index;
    if (isFocused) {
      L.DomUtil.addClass(this.refs.marker.leafletElement._icon, 'focused');
    } else {
      L.DomUtil.removeClass(this.refs.marker.leafletElement._icon, 'focused');
    }
  }

  handleSetFocus() {
    const { dispatch, index } = this.props;
    dispatch(StopPlaceActions.setElementFocus(index, 'parking'));
    document.querySelector(".pr-item-expanded").scrollIntoView(true);
    document.querySelector("#scroll-body").scrollTop -= 50;
  }

  shouldComponentUpdate(nextProps) {
    return shallowCompare(this, nextProps);
  }

  render() {
    const {
      position,
      index,
      handleDragEnd,
      translations,
      name,
      hasExpired,
      totalCapacity,
      draggable,
    } = this.props;

    if (!position) return null;

    const icon = L.icon({
      iconUrl: ParkingIcon,
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      popupAnchor: [0, 15],
      className: hasExpired ? 'expired' : ''
    });

    return (
      <Marker
        draggable={draggable}
        position={position}
        icon={icon}
        key={'parking-marker' + index}
        onDragend={event => {
          handleDragEnd(index, 'parking', event);
        }}
        ref="marker"
      >
        <Popup autoPan={false} onOpen={() => { this.handleSetFocus() }}>
          <div>
            <div style={{marginTop: 10, fontWeight: 600, color: 'red', marginBottom: 10, textAlign: 'center'}}>{hasExpired && translations.parkingExpired}</div>
            <div
              style={{
                fontWeight: 600,
                textAlign: 'center',
                margin: '5 0',
                fontSize: '1.1em',
                color: enturPrimaryDarker,
              }}
            >
              {name}
            </div>
            <div
              style={{
                marginTop: -2,
                textAlign: 'center',
                marginBottom: 5,
                fontWeight: 600,
                fontSize: '1em',
              }}
            >
              <div>{translations.title}</div>
            </div>
            <div
              style={{
                marginTop: -2,
                marginBottom: 5,
                fontSize: '1em',
                color: '#191919',
              }}
            >
              {translations.totalCapacity}:
              <span
                style={{
                  fontStyle: typeof totalCapacity === 'number'
                    ? 'normal'
                    : 'italic',
                  marginLeft: 1,
                }}
              >
                {typeof totalCapacity === 'number'
                  ? totalCapacity
                  : translations.totalCapacityUnknown}
              </span>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }
}

const mapStateToProps = state => ({
  focusedElement: state.mapUtils.focusedElement,
});

export default connect(mapStateToProps)(ParkingAndRideMarker);
