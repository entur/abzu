import React from 'react'
import newStopIcon from '../static/icons/new-stop-icon-2x.png'
import RaisedButton from 'material-ui/RaisedButton'
import MdSettings from 'material-ui/svg-icons/action/settings'
import Toggle from 'material-ui/Toggle'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import NewElementsBox from './NewElementsBox'
import FlatButton from 'material-ui/FlatButton'
import { injectIntl } from 'react-intl'
import '../styles/editStopSideBar.css'

class EditStopSideBar extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      sliderIndex: 0
    }
  }

  handleToggleMultiPolylines(event, value) {
    this.props.dispatch(UserActions.toggleMultiPolylinesEnabled(value))
  }

  handleToggleCompassBearing(event, value) {
    this.props.dispatch(UserActions.toggleCompassBearingEnabled(value))
  }

  render() {

    const { sliderIndex } = this.state
    const { isMultiPolylinesEnabled, isCompassBearingEnabled, intl } = this.props
    const { formatMessage } = intl

    return (
      <div className="editStopSideBar">
        <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
          <RaisedButton
            backgroundColor="#a4c639"
            icon={<img src={newStopIcon} style={{height: 25, width: 18}}/>}
            label={`+ ${formatMessage({id: 'add'})}`}
            buttonStyle={{background: sliderIndex === 1 ? '#f4f4f4' : '#fff', textAlign: 'left'}}
            style={{width: '100%'}}
            labelStyle={{fontSize: 13}}
            onClick={() => this.setState({sliderIndex: 1})}
          />
          <RaisedButton
            backgroundColor="#a4c639"
            icon={<MdSettings style={{height: 25, width: 20}}/>}
            label={formatMessage({id: 'settings'})}
            buttonStyle={{background: sliderIndex === 2 ? '#f4f4f4' : '#fff', textAlign: 'left'}}
            style={{width: '100%'}}
            labelStyle={{fontSize: 13}}
            onClick={() => this.setState({sliderIndex: 2})}
          />
        </div>
        <div>
          { sliderIndex === 1 ? <NewElementsBox/> : null }
          { sliderIndex === 2
            ?
              <div style={{display: 'flex', flexDirection: 'column', padding: 10}}>
                <Toggle
                  style={{paddingTop: 5, textAlign: 'center'}}
                  label={formatMessage({id: 'show_path_links'})}
                  toggled={isMultiPolylinesEnabled}
                  onToggle={this.handleToggleMultiPolylines.bind(this)}
                  labelStyle={{width: 'initial', fontSize: '0.8em'}}
                  labelPosition="right"
                />
                <Toggle
                  style={{paddingTop: 5, textAlign: 'center'}}
                  label={formatMessage({id: 'show_compass_bearing'})}
                  onToggle={this.handleToggleCompassBearing.bind(this)}
                  toggled={isCompassBearingEnabled}
                  labelStyle={{width: 'initial', fontSize: '0.8em'}}
                  labelPosition="right"
                />
            </div> : null }
        </div>
        { sliderIndex > 0 ?
          <div style={{width: '100%', textAlign: 'center'}}>
            <FlatButton onClick={ () => this.setState({sliderIndex: 0})} label="X" />
          </div>
          : null
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isMultiPolylinesEnabled: state.editingStop.enablePolylines,
    isCompassBearingEnabled: state.editingStop.isCompassBearingEnabled
  }
}


export default injectIntl(connect(mapStateToProps)(EditStopSideBar))