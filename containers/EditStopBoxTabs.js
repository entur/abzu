import React from 'react';
import QuayItem from '../components/QuayItem';
import PathJunctionItem from '../components/PathJunctionItem';
import EntranceItem from '../components/EntranceItem';
import ParkingItem from '../components/ParkingItem';
import { connect } from 'react-redux';
import { StopPlaceActions, UserActions } from '../actions/';

class EditStopBoxTabs extends React.Component {
  handleLocateOnMap(position, index, type) {
    this.props.dispatch(StopPlaceActions.changeMapCenter(position, 17));
    this.props.dispatch(StopPlaceActions.setElementFocus(index, type));
  }

  handleRemoveQuay(index, quayId) {
    const { dispatch, activeStopPlace } = this.props
    if (!quayId) {
      dispatch(StopPlaceActions.removeElementByType(index, 'quay'));
    } else {
      dispatch(UserActions.requestDeleteQuay(activeStopPlace.id, quayId))
    }
  }

  handleOpenKeyValuesDialog(keyValues, type, index) {
    this.props.dispatch(UserActions.openKeyValuesDialog(keyValues, type, index));
  }

  handleRemoveEntrance(index) {
    this.props.dispatch(
      StopPlaceActions.removeElementByType(index, 'entrance'),
    );
  }

  handleRemovePathJunction(index) {
    this.props.dispatch(
      StopPlaceActions.removeElementByType(index, 'pathJunction'),
    );
  }

  handleToggleCollapse(index, type) {
    const { dispatch, expandedItem, keyValuesDialogOpen, keyValuesOrigin } = this.props;
    const isExpanded =
      expandedItem.type === type && expandedItem.index == index;
    dispatch(StopPlaceActions.setElementFocus(isExpanded ? -1 : index, type));

  }

  getParkingType(parking) {
    if (parking.parkingVehicleTypes.indexOf('car') > -1) return 'parkAndRide';
    if (parking.parkingVehicleTypes.indexOf('pedalCycle') > -1)
      return 'bikeParking';
    return 'unknown';
  }

  getQuayItems(
    activeStopPlace,
    expandedItem,
    itemTranslation,
    noElementsStyle,
    disabled,
  ) {
    return activeStopPlace.quays.length
      ? activeStopPlace.quays.map((quay, index) =>
          <QuayItem
            key={'quay-' + index}
            quay={quay}
            disabled={disabled}
            ref={'quay-' + index}
            index={index}
            publicCode={quay.publicCode}
            handleRemoveQuay={() => this.handleRemoveQuay(index, quay.id)}
            handleOpenKeyValuesDialog={ () => this.handleOpenKeyValuesDialog(quay.keyValues, 'quay', index)}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            stopPlaceType={activeStopPlace.stopPlaceType}
            expanded={
              expandedItem.type === 'quay' && index === expandedItem.index
            }
          />,
        )
      : <div style={noElementsStyle}>
          {itemTranslation.none} {itemTranslation.quays}
        </div>;
  }

  getNavigationItems(
    activeStopPlace,
    expandedItem,
    itemTranslation,
    noElementsStyle,
    disabled,
  ) {
    const elementsHeaderStyle = {
      fontWeight: 600,
      textTransform: 'capitalize',
      fontSize: '0.8em',
      marginTop: 30,
      textAlign: 'center',
      marginBottom: 10,
      color: '#2196F3',
    };

    const hasElements =
      activeStopPlace.pathJunctions.length || activeStopPlace.entrances.length;

    return hasElements
      ? <div>
          <div style={elementsHeaderStyle}>
            {' '}{itemTranslation.pathJunctions}
            {' '}
          </div>
          {activeStopPlace.pathJunctions.map((pathJunction, index) =>
            <PathJunctionItem
              translations={itemTranslation}
              pathJunction={pathJunction}
              disabled={disabled}
              key={'pathJunction-' + index}
              index={index}
              handleRemovePathJunction={() =>
                this.handleRemovePathJunction(index)}
              handleLocateOnMap={this.handleLocateOnMap.bind(this)}
              handleToggleCollapse={this.handleToggleCollapse.bind(this)}
              expanded={
                expandedItem.type === 'pathJunction' &&
                index === expandedItem.index
              }
            />,
          )}

          <div style={elementsHeaderStyle}> {itemTranslation.entrances} </div>
          {activeStopPlace.entrances.map((entrance, index) =>
            <EntranceItem
              translations={itemTranslation}
              key={'entrance-' + index}
              disabled={disabled}
              entrance={entrance}
              index={index}
              handleRemoveEntrance={() => this.handleRemoveEntrance(index)}
              handleLocateOnMap={this.handleLocateOnMap.bind(this)}
              handleToggleCollapse={this.handleToggleCollapse.bind(this)}
              expanded={
                expandedItem.type === 'entrance' && index === expandedItem.index
              }
            />,
          )}
        </div>
      : <div style={noElementsStyle}>
          {itemTranslation.none} {itemTranslation.elements}
        </div>;
  }

  getParkingElements(
    activeStopPlace,
    expandedItem,
    itemTranslation,
    noElementsStyle,
    disabled,
  ) {
    return activeStopPlace.parking.length
      ? activeStopPlace.parking.map((parking, index) => {
          const parkingType = this.getParkingType(parking);
          return (
            <ParkingItem
              translations={itemTranslation}
              key={'parking-' + index}
              disabled={disabled}
              index={index}
              parking={parking}
              parkingType={parkingType}
              handleLocateOnMap={this.handleLocateOnMap.bind(this)}
              handleToggleCollapse={this.handleToggleCollapse.bind(this)}
              expanded={
                expandedItem.type === 'parking' && index === expandedItem.index
              }
            />
          );
        })
      : <div style={noElementsStyle}>
          {itemTranslation.none} {itemTranslation.parking}
        </div>;
  }

  render() {
    const noElementsStyle = {
      fontStyle: 'italic',
      marginTop: 100,
      textAlign: 'center',
      fontSize: '0.8em',
    };

    const tabContainerStyle = {
      height: 220,
      position: 'relative',
      display: 'block',
    };

    const {
      activeElementTab,
      itemTranslation,
      activeStopPlace,
      expandedItem,
      disabled,
    } = this.props;

    return (
      <div style={tabContainerStyle}>
        {activeElementTab === 0
          ? this.getQuayItems(
              activeStopPlace,
              expandedItem,
              itemTranslation,
              noElementsStyle,
              disabled,
            )
          : null}
        {activeElementTab === 1
          ? this.getNavigationItems(
              activeStopPlace,
              expandedItem,
              itemTranslation,
              noElementsStyle,
              disabled,
            )
          : null}
        {activeElementTab === 2
          ? this.getParkingElements(
              activeStopPlace,
              expandedItem,
              itemTranslation,
              noElementsStyle,
              disabled,
            )
          : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  activeElementTab: state.user.activeElementTab,
  expandedItem: state.mapUtils.focusedElement,
});

export default connect(mapStateToProps)(EditStopBoxTabs);
