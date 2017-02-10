import React from 'react'
import QuayItem from '../components/QuayItem'
import PathJunctionItem from '../components/PathJunctionItem'
import EntranceItem from '../components/EntranceItem'
import { connect } from 'react-redux'
import { MapActions } from '../actions/'

class EditStopBoxTabs extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      expandedItem: {
        index: -1,
        type: 'quay',
      }
    }
  }

  handleLocateOnMap(centroid) {
    const position = {
      lat: centroid.location.latitude,
      lng: centroid.location.longitude
    }
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
    this.setState({
      expandedItem: {
        index: this.state.expandedItem.index === index ? -1 : index,
        type: type,
      }
    })
  }

  /*handleSetFocus = (index, type) => {
    const { dispatch } = this.props
    dispatch(MapActions.setElementFocus(index, type))
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { expandedItem } = nextState
    this.handleSetFocus(expandedItem.index, expandedItem.type)
    return true
  }*/

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
      marginTop: -70
    }

    const { activeElementTab, itemTranslation, activeStopPlace } = this.props
    const { expandedItem } = this.state

    return (
      <div style={tabContainerStyle}>
        { activeElementTab === 0 && activeStopPlace.quays.map( (quay,index) =>
          <QuayItem
            translations={itemTranslation}
            key={"quay-" + index}
            quay={quay}
            ref={'quay-' + index}
            index={index}
            name={quay.name}
            handleRemoveQuay={() => this.handleRemoveQuay(index)}
            handleLocateOnMap={this.handleLocateOnMap.bind(this)}
            handleToggleCollapse={this.handleToggleCollapse.bind(this)}
            expanded={expandedItem.type === 'quay' && index === expandedItem.index}
          />
        )}
        { activeElementTab === 0 && !activeStopPlace.quays.length
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.quays}</div> : null
        }
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
        { activeElementTab === 1 && !activeStopPlace.pathJunctions.length
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.pathJunctions}</div> : null
        }
        { activeElementTab === 2 && activeStopPlace.entrances.map( (entrance,index) =>
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
        { activeElementTab === 2 && !activeStopPlace.entrances.length
          ? <div style={noElementsStyle}>{itemTranslation.none} {itemTranslation.entrances}</div> : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    activeElementTab: state.user.activeElementTab,
  }
}

export default connect(mapStateToProps)(EditStopBoxTabs)

