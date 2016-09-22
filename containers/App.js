import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import cfgreader from './../config/readConfig'

class App extends React.Component {

  constructor(props) {
    super(props)

    cfgreader.readConfig( (function(config) {
      window.config = config
    }).bind(this))
  }

  render() {

    const { children } = this.props

    return (
      <MuiThemeProvider>
        <div>
          <Header/>
          {children}
          <Footer/>
        </div>
      </MuiThemeProvider>
    )
  }

}

export default App
