import React, { Component, PropTypes } from 'react'

class MarkerCluster extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return true
  }

  render() {
    return <div>{this.props.children}</div>
  }

}

export default MarkerCluster
