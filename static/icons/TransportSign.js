import React from 'react'
import IconButton from 'material-ui/IconButton'

const TransportSign = props => {
  return (
    <IconButton { ...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 500"
      >
        <defs>
          <pattern id="pattern-0" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" viewBox="0 0 100 100">
            <path d="M 0 0 L 50 0 L 50 100 L 0 100 Z" style={{fill: "black"}}/>
          </pattern>
        </defs>
        <path d="M -91.02 113.785 Z" style={{fill: "green", stroke: 'black'}} />
        <path d="M -63.004 150.496 L -62.038 150.496 Z"  style={{fill: "none", stroke: 'black'}}/>
        <rect style={{fill: 'rgb(216, 216, 216)'}}/>
        <rect x="205.848" y="39.399" width="65.118" height="445.355"/>
        <rect x="96.396" y="49.059" width="283.056" height="158.434" style={{strokeWidth: 10, strokeLinecap: 'round', stroke: 'rgb(0,0,0)'}} />
        <rect style={{fill: 'rgb(150,150,150)'}}/>
      </svg>
    </IconButton>
  )
}

export default TransportSign
