import React from 'react'
import MdInfo from 'material-ui/svg-icons/action/info'


const ToolTipIcon = ({title}) => (
  <div className="tooltip">
    <MdInfo color="#41c0c4"/>
    <span className="tooltiptext"> { title } </span>
  </div>
)

export default ToolTipIcon