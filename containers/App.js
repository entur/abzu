import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import Header from '../components/Header'
import cfgreader from '../config/readConfig'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import Snackbar from 'material-ui/Snackbar'
import { injectIntl } from 'react-intl'
import * as types from '../actions/Types'
import MdCheck from 'material-ui/svg-icons/navigation/check'
import MdError from 'material-ui/svg-icons/alert/error'
import enturTheme from '../config/enturTheme'

class App extends React.Component {

  constructor(props) {
    super(props)

    cfgreader.readConfig( (function(config) {
      window.config = config
      console.info('Config loaded', config)
    }).bind(this))
  }

  handleRequestClose() {
    const { dispatch } = this.props
    dispatch ( UserActions.dismissSnackbar() )
  }


  getAlertIcon(status) {
    if (status === types.SUCCESS) {
      return <MdCheck style={{fill: '#088f17', color: '#fff', marginRight: 10}} />
    } else if (status == types.ERROR) {
      return <MdError style={{fill: '#cc0000', color: '#fff', marginRight: 10}} />
    } else  {
      return null
    }
  }

  render() {

    const { children, snackbarOptions, intl } = this.props
    const { formatMessage } = intl

    let { message, isOpen, status } = snackbarOptions
    let snackBarMessage = formatMessage({id: (message || '_empty')})

    const muiTheme = getMuiTheme(enturTheme)

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <div className="version">v{process.env.VERSION}</div>
          <Header
            intl={intl}
            />
          {children}
          <Snackbar
            open={isOpen}
            message={
              <div style={{color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                { this.getAlertIcon(status) }  { snackBarMessage }
                </div>
            }
            bodyStyle={{background: '#000', opacity: '0.8'}}
            autoHideDuration={3000}
            onRequestClose={this.handleRequestClose.bind(this)}
            />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => ({
  snackbarOptions: state.user.snackbarOptions,
})

export default injectIntl(connect(mapStateToProps)(App))
