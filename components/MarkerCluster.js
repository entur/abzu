import React, { Component, PropTypes } from 'react'

class MarkerCluster extends React.Component {

  render() {

    const { children, layerContainer } = this.props

    return <div>{this.props.children}</div>
  }

}

export default MarkerCluster
