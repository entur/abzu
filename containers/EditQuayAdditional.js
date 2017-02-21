import React from 'react'
import MdLess from 'material-ui/svg-icons/navigation/close'
import { Tabs, Tab } from 'material-ui/Tabs'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import FacilitiesQuayTab from '../components/FacilitiesQuayTab'
import AccessiblityQuayTab from '../components/AcessibilityQuayTab'
import { injectIntl } from 'react-intl'

class EditQuayAdditional extends React.Component {

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

  handleAdditionalQuayOnClose = () => {
    this.props.dispatch(UserActions.hideEditQuayAdditional())
  }

  render() {

    const { intl, stopPlace, focusedElement } = this.props
    const { formatMessage } = intl

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
            onClick={this.handleAdditionalQuayOnClose.bind(this)}
          />
        </div>
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{backgroundColor: '#fff', marginTop: -5}}
        >
          <Tab style={tabStyle} label={formatMessage({id: 'accessibility'})} value={0}>
            <AccessiblityQuayTab intl={intl} />
          </Tab>
          <Tab style={tabStyle} label={formatMessage({id: 'facilities'})} value={1}>
            <FacilitiesQuayTab intl={intl}/>
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const getElementTitle = (stop, focusedElement) => {

  if (!stop || !focusedElement) return 'N/A'

  if (focusedElement.type == 'quay' && focusedElement.index > -1) {
    return stop.quays[focusedElement.index].id || '?'
  }
  return 'N/A'
}

const mapStateToProps = state => ({
  focusedElement: state.editingStop.focusedElement,
  stopPlace: state.stopPlace.current
})


export default injectIntl(connect(mapStateToProps)(EditQuayAdditional))
