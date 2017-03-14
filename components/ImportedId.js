import React from 'react'

const ImportedId = ({ text, id }) => {

  if (!id) return null

  return (
    <div
      style={{fontSize: 10}}>
      <div style={{fontWeight: 600}}>{ text }</div>
      <div>{ id.join(', ') }</div>
      </div>
  )
}

export default ImportedId