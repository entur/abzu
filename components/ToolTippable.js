import React, { PropTypes } from 'react'

class ToolTippable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showToolTip: false
    }
  }

  static PropTypes = {
    toolTipText: PropTypes.string.isRequired,
  }

  handleShowToolTip() {
    const { showToolTip } = this.state
    if (!showToolTip) {
      this.setState({
        showToolTip: true
      })
    }
  }

  handleHideToolTip() {
    const { showToolTip } = this.state
    if (showToolTip) {
      this.setState({
        showToolTip: false
      })
    }
  }

  render() {
    const { children, toolTipText, toolTipStyle } = this.props
    const { showToolTip } = this.state

    const defaultStyle = {
      background: '#595959',
      position: 'fixed',
      marginTop: 5,
      padding: 5,
      fontSize: 12,
      zIndex: 99999,
      color: '#fff'
    }

    const appliedStyle = { ...defaultStyle, ...toolTipStyle }

    return (
      <div
        onMouseOver={this.handleShowToolTip.bind(this)}
        onMouseOut={this.handleHideToolTip.bind(this)}
      >
        { children }
        { showToolTip && <span style={appliedStyle}>{ toolTipText }</span> }
      </div>
    )
  }
}

export default ToolTippable