import React from 'react'

export default ({number, color}) => {

  let numberCircleStyle = {
    display: 'block',
    height: 20,
    width: 20,
    lineHeight: '25px',
    borderRadius: 10,
    backgroundColor: color || '#000',
    color: '#fff',
    textAlign: 'center',
    fontSize: 12,
  }

  return (
    <div style={numberCircleStyle}>
      {number}
    </div>
  )
}