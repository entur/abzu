import React from 'react'
import MdInfo from 'material-ui/svg-icons/action/info'


const ToolTipIcon = ({title}) => (
  <div className="tooltip">
    <MdInfo color="#62cc10"/>
    <span className="tooltiptext"> { title } </span>
  </div>
)

export default ToolTipIcon