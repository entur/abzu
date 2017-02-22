import React from 'react'
import MdHelp from 'material-ui/svg-icons/action/help'


const ToolTipIcon = ({title}) => (
  <div className="tooltip">
    <MdHelp color="orange"/>
    <span className="tooltiptext"> { title } </span>
  </div>
)

export default ToolTipIcon