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

    const { showEditStopAdditional, intl } = this.props
    const { formatMessage } = intl

    if (!showEditStopAdditional) return null

    const style = {
      top: 80,
      border: '1px solid #511E12',
      background: '#fff',
      width: 410,
      margin: 10,
      height: 754,
      position: 'absolute',
      zIndex: 1000,
      left: 440,
      padding: '10 5'
    }

    const tabStyle = {
      color: '#000',
      fontSize: '0.7em',
      fontWeight: 600,
      marginTop: -10
    }

    const stopBoxBar = {
      float: 'right',
      paddingLeft: 5,
      paddingRight: 5,
      paddingTop: 5,
      top: -10,
      left: 5,
      position:'relative',
      color: '#fff',
      background: '#191919',
      width: '100%',
      textAlign: 'left',
      fontSize: '0.8em',
      fontWeight: '0.9em',
      heigth: 19
    }

    const { activeTabIndex } = this.state

    return (
      <div style={style} id="additional">
        <div style={stopBoxBar}>
          <MdLess style={{height: 15, width: 15, float: 'right', color: '#fff'}} onClick={this.handleOnClose.bind(this)} />
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

const mapStateToProps = state => ({
  showEditStopAdditional: state.user.showEditStopAdditional,
})


export default injectIntl(connect(mapStateToProps)(EditStopAdditional))
