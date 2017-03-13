import React from 'react'
import QuayItem from '../components/QuayItem'
import PathJunctionItem from '../components/PathJunctionItem'
import EntranceItem from '../components/EntranceItem'
import ParkingItem from '../components/ParkingItem'
import { connect } from 'react-redux'
import { MapActions } from '../actions/'

class EditStopBoxTabs extends React.Component {

  handleLocateOnMap(position) {
    this.props.dispatch(MapActions.changeMapCenter(position, 17))
  }

  handleRemoveQuay(index) {
    this.props.dispatch(MapActions.removeElementByType(index, 'quay'))
  }

  handleRemoveEntrance(index) {
    this.props.dispatch(MapActions.removeElementByType(index, 'entrance'))
  }

  handleRemovePathJunction(index) {
    this.props.dispatch(MapActions.removeElementByType(index, 'pathJunction'))
  }

  handleToggleCollapse(index, type) {
    const { dispatch, expandedItem } = this.props
    const isExpanded = expandedItem.type === type && expandedItem.index == index
    dispatch(MapActions.setElementFocus(isExpanded ? -1 : index, type))
  }

  handleRemoveParking(index) {
    this.props.dispatch(MapActions.removeElementByType(index, 'parking'))
  }

  render() {

    const noElementsStyle = {
      fontStyle: 'italic',
      marginTop: 100,
      textAlign: 'center',
      fontSize: '0.8em'
    }

    const tabContainerStyle = {
      height: 220,
      position: "relative",
      display: "block",
    }

    const { activeElementTab, itemTranslation, activeStopPlace, expandedItem } = this.props

    return (
      <div style={tabContainerStyle}>
        { activeElementTab === 0 && activeStopPlace.quays.map( (quay,index) =>
          <QuayItem
            key={"quay-" + index}
            quay={quay}
            ref={'quay-' + index}
            index={index}
            publicCode={quay.publicCode}
            handleRemoveQuay={() => this.handleRemoveQuay(index)}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            stopPlaceType={activeStopPlace.stopPlaceType}
            expanded={expandedItem.type === 'quay' && index === expandedItem.index}
          />
        )}
        { activeElementTab === 0 && !activeStopPlace.quays.length
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.quays}</div> : null
        }
        <span>Pathjunction elements:</span>
        { activeElementTab === 1 && activeStopPlace.pathJunctions.map( (pathJunction,index) =>
          <PathJunctionItem
            translations={itemTranslation}
            pathJunction={pathJunction}
            key={"pathJunction-" + index}
            index={index}
            handleRemovePathJunction={() => this.handleRemovePathJunction(index)}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            expanded={expandedItem.type === 'pathJunction' && index === expandedItem.index}
          />
        )}
        <span>Entrance elements:</span>
        { activeElementTab === 1 && activeStopPlace.entrances.map( (entrance,index) =>
          <EntranceItem
            translations={itemTranslation}
            key={"entrance-" + index}
            entrance={entrance}
            index={index}
            handleRemoveEntrance={() => this.handleRemoveEntrance(index)}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            expanded={expandedItem.type === 'entrance' && index === expandedItem.index}
          />
        )}
        { activeElementTab === 1 && ( !activeStopPlace.entrances.length && !activeStopPlace.pathJunctions.length )
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.elements}</div> : null
        }
        { activeElementTab === 2 && !activeStopPlace.parking.length
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.parking}</div> : null
        }
        { activeElementTab === 2 && activeStopPlace.parking.map( (parking,index) =>
          <ParkingItem
            translations={itemTranslation}
            key={"parking-" + index}
            index={index}
            parking={parking}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleRemoveParking={() => this.handleRemoveParking(index)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            expanded={expandedItem.type === 'parking' && index === expandedItem.index}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeElementTab: state.user.activeElementTab,
    expandedItem: state.editingStop.focusedElement
  }
}

export default connect(mapStateToProps)(EditStopBoxTabs)

