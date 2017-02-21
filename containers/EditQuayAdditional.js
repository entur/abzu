import React from 'react'
import MdLess from 'material-ui/svg-icons/navigation/close'
import { Tabs, Tab } from 'material-ui/Tabs'
import FlatButton from 'material-ui/FlatButton'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import FacilitiesTab from '../components/FacilitiesTab'
import AccessiblityTab from '../components/AcessibilityTab'
import { injectIntl } from 'react-intl'


class EditStopAdditional extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      activeTabIndex: 0
    }
  }

  handleTabOnChange = value => {
    this.setState({
      activeTabIndex: value
    })
  }

  handleOnClose = () => {
    this.props.dispatch(UserActions.hideEditStopAdditional())
  }

  render() {

    const { showEditStopAdditional, intl, stopPlace, focusedElement } = this.props
    const { formatMessage } = intl

    if (!showEditStopAdditional) return null

    const style = {
      background: '#fff',
    }

    const tabStyle = {
      color: '#000',
      fontSize: '0.7em',
      fontWeight: 600,
      marginTop: -10
    }

    const stopBoxBar = {
      color: '#000',
      fontSize: '0.8em',
      height: 19
    }

    const { activeTabIndex } = this.state

    return (
      <div style={style} id="additional">
        <div style={stopBoxBar}>
          <span style={{fontWeight: 600}}>{ getElementTitle(stopPlace, focusedElement) }</span>
          <MdLess
            style={{height: 15, width: 15, float: 'right', color: '#000', cursor: 'pointer', marginBottom: 20}}
            onClick={this.handleOnClose.bind(this)}
          />
        </div>
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{backgroundColor: '#fff', marginTop: -5}}
        >
          <Tab style={tabStyle} label={formatMessage({id: 'accessibility'})} value={0}>
            <AccessiblityTab intl={intl} />
          </Tab>
          <Tab style={tabStyle} label={formatMessage({id: 'facilities'})} value={1}>
            <FacilitiesTab intl={intl}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const getElementTitle = (stop, focusedElement) => {

  console.log(stop, focusedElement)

  if (!stop || !focusedElement) return 'N/A'

  if (focusedElement.type == 'quay') {
    return stop.quays[focusedElement.index].id || '?'
  }

  return 'N/A'
}

const mapStateToProps = state => ({
  showEditStopAdditional: state.user.showEditStopAdditional,
  focusedElement: state.editingStop.focusedElement,
  stopPlace: state.stopPlace.current
})


export default injectIntl(connect(mapStateToProps)(EditStopAdditional))
