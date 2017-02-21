import React from 'react'
import { connect }  from 'react-redux'
import Toggle from 'material-ui/Toggle'
import { UserActions } from '../actions/'
import { injectIntl } from 'react-intl'

class ToggleMapItemsBox extends React.Component {

  handleToggleMultiPolylines(event, value) {
    this.props.dispatch(UserActions.toggleMultiPolylinesEnabled(value))
  }

  handleToggleCompassBearing(event, value) {
    this.props.dispatch(UserActions.toggleCompassBearingEnabled(value))
  }

  render() {

    const { isMultiPolylinesEnabled, isCompassBearingEnabled } = this.props
    const { formatMessage } = this.props.intl

    const boxWrapperStyle = {
      background: '#fff',
      position: 'absolute',
      top: '62.5vh',
      right: '2vw',
      margin: 5,
      width: 220,
      border: '1px solid #511e12',
      zIndex: 999,
      cursor: 'move',
      fontSize: '0.8em',
    }

    const stopBoxBar = {
      color: '#fff',
      background: '#191919',
      textAlign: 'left',
      fontWeight: '0.9em',
      fontSize: '0.8em',
      position: 'relative',
      paddingTop: 3,
      paddingLeft: 2
    }

    return (
      <div ref='ToggleMapItemsBox' style={boxWrapperStyle}>
          <div style={stopBoxBar}>{formatMessage({id: 'aditional_map_elements'})}</div>
        <div style={{display: 'flex', flexDirection: 'column', padding: 5}}>
          <Toggle
            style={{paddingTop: 5, textAlign: 'center'}}
            label={formatMessage({id: 'show_path_links'})}
            toggled={isMultiPolylinesEnabled}
            onToggle={this.handleToggleMultiPolylines.bind(this)}
            labelStyle={{width: 'initial'}}
            labelPosition="right"
          />
          <Toggle
            style={{paddingTop: 5, textAlign: 'center'}}
            label={formatMessage({id: 'show_compass_bearing'})}
            toggled={isCompassBearingEnabled}
            onToggle={this.handleToggleCompassBearing.bind(this)}
            labelStyle={{width: 'initial'}}
            labelPosition="right"
          />
        </div>

      </div>
    )
  }

  componentDidMount() {
    new L.Draggable(this.refs.ToggleMapItemsBox).enable()
  }
}

const mapStateToProps = state => {
  return {
    isMultiPolylinesEnabled: state.editingStop.enablePolylines,
    isCompassBearingEnabled: state.editingStop.isCompassBearingEnabled
  }
}


export default injectIntl(connect(mapStateToProps)(ToggleMapItemsBox))
