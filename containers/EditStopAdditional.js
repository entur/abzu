import React from 'react'
import { Tabs, Tab } from 'material-ui/Tabs'
import { connect } from 'react-redux'
import FacilitiesStopTab from '../components/FacilitiesStopTab'
import AcessibilityStopTab from '../components/AcessibilityStopTab'
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

  render() {

    const { intl, disabled } = this.props
    const { formatMessage } = intl

    const style = {
      background: '#fff',
    }

    const tabStyle = {
      color: '#000',
      fontSize: '0.7em',
      fontWeight: 600,
    }

    const { activeTabIndex } = this.state

    return (
      <div style={style} id="additional">
        <Tabs
          onChange={this.handleTabOnChange.bind(this)}
          value={activeTabIndex}
          tabItemContainerStyle={{backgroundColor: '#fff', marginTop: -5}}
        >
          <Tab style={tabStyle} label={formatMessage({id: 'accessibility'})} value={0}>
            <AcessibilityStopTab intl={intl} disabled={disabled} />
          </Tab>
          <Tab style={tabStyle} label={formatMessage({id: 'facilities'})} value={1}>
            <FacilitiesStopTab intl={intl} disabled={disabled} />
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  stopPlace: state.stopPlace.current
})


export default injectIntl(connect(mapStateToProps)(EditStopAdditional))
