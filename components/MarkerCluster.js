import React, { Component, PropTypes } from 'react'

class MarkerCluster extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.children !== nextProps.children
  }

  render() {
    return <div>{this.props.children}</div>
  }

}

export default MarkerCluster
