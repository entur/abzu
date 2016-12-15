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
      top: '82vh',
      padding: 10,
      margin: 20,
      width: 250,
      border: '1px solid #511e12',
      zIndex: 999
    }

    const stopBoxBar = {
      float: 'right',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      top: -10,
      left: 10,
      position:'relative',
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontWeight: '0.9em'
    }

    return (
      <div style={boxWrapperStyle}>
          <div style={stopBoxBar}>{formatMessage({id: 'aditional_map_elements'})}</div>
          <Toggle
            style={{paddingTop: 5, width: 250, textAlign: 'center'}}
            label={formatMessage({id: 'show_path_links'})}
            toggled={isMultiPolylinesEnabled}
            onToggle={this.handleToggleMultiPolylines.bind(this)}
            labelStyle={{width: 'initial'}}
          />
          <Toggle
            style={{paddingTop: 5, width: 250, textAlign: 'center'}}
            label={formatMessage({id: 'show_compass_bearing'})}
            toggled={isCompassBearingEnabled}
            onToggle={this.handleToggleCompassBearing.bind(this)}
            labelStyle={{width: 'initial'}}
          />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isMultiPolylinesEnabled: state.editStopReducer.enablePolylines,
    isCompassBearingEnabled: state.editStopReducer.isCompassBearingEnabled
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ToggleMapItemsBox))
