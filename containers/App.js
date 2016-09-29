import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import cfgreader from '../config/readConfig'
import { connect } from 'react-redux'
import { UserActions } from '../actions/'

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

  render() {

    const { children } = this.props

    return (
      <MuiThemeProvider>
        <div>
          <Header handleNavigateToMain={this.handleNavigateToMain.bind(this)}/>
          {children}
          <Footer/>
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

export default connect(null, mapDispatchToProps)(App)
