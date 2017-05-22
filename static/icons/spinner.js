import React from 'react'
import IconButton from 'material-ui/IconButton'
import "../../styles/spinner.css"

const spinner = props => (
  <IconButton {...props}>
    <svg className="spinner" width="20px" height="20px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
      <circle className="path" fill="none" strokeWidth="6" strokeLinecap="round" cx="33" cy="33" r="30"></circle>
    </svg>
  </IconButton>
)

export default spinner
