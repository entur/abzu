import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from '../components/Header'
import cfgreader from '../config/readConfig'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import Snackbar from 'material-ui/Snackbar'
import * as types from './../actions/actionTypes'
import {intlShape, injectIntl, defineMessages} from 'react-intl'

class App extends React.Component {

  constructor(props) {
    super(props)

    cfgreader.readConfig( (function(config) {
      window.config = config
      console.info('Config loaded', config)
    }).bind(this))
  }

  handleNavigateToMain() {
    const { dispatch } = this.props
    dispatch ( UserActions.navigateTo('/', '') )
  }

  handleRequestClose() {
    const { dispatch } = this.props
    dispatch ( UserActions.dismissSnackbar() )
  }

  handleSetLanguage(locale) {
    const { dispatch } = this.props
    dispatch ( UserActions.applyLocale(locale) )
  }

  render() {

    const { children, snackbarOptions } = this.props
    const { formatMessage } = this.props.intl

    let { message, isOpen } = snackbarOptions
    let headerText = {
      signOut: formatMessage({id: 'sign_out'}),
      help: formatMessage({id: 'help'}),
      title: formatMessage({id: '_title'}),
      language: formatMessage({id: 'language'}),
      english: formatMessage({id: 'english'}),
      norwegian: formatMessage({id: 'norwegian'}),
    }

    let snackBarMessage = formatMessage({id: (message || '_empty')})

    return (
      <MuiThemeProvider>
        <div>
          <Header
            text={headerText}
            handleNavigateToMain={this.handleNavigateToMain.bind(this)}
            setLanguage={this.handleSetLanguage.bind(this)}
            />
          {children}
          <Snackbar
            open={isOpen}
            message={snackBarMessage}
            bodyStyle={{background: '#fff'}}
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose.bind(this)}
            />
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dispatch: dispatch
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    snackbarOptions: state.userReducer.snackbarOptions
  }
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(App))
