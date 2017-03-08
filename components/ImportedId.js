import React from 'react'

const ImportedId = ({ text, id }) => {
  return (
    <div
      style={{fontSize: 10, marginBottom: 10}}>
      <div style={{fontWeight: 600}}>{ text }</div>
      <div>{ id.join(', ') }</div>
      </div>
  )
}

export default ImportedId