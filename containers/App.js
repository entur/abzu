import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default ({ children }) => {
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
