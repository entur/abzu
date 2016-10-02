import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from '../components/Header'
import cfgreader from '../config/readConfig'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'
import Snackbar from 'material-ui/Snackbar'
import * as types from './../actions/actionTypes'

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

  render() {
    // TODO: move snackbar as standalone component and resolve issue around styles 
    const { children, snackbarOptions } = this.props
    let { message, isOpen } = snackbarOptions

    return (
      <MuiThemeProvider>
        <div>
          <Header handleNavigateToMain={this.handleNavigateToMain.bind(this)}/>
          {children}
          <Snackbar
            open={isOpen}
            message={message || ''}
            bodyStyle={{background: 'white'}}
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

export default connect(mapStateToProps, mapDispatchToProps)(App)
