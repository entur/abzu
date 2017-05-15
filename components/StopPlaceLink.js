import React from 'react'

export default ({id}) => {
  const url = window.location.origin + window.config.endpointBase + 'edit/' + id
  return (
    <a target="_blank" href={url}>{id}</a>
  )
}