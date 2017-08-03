import React from 'react';
import PropTypes from 'prop-types';

class ToolTippable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showToolTip: false,
      top: 0,
      left: 0,
    };
  }

  static PropTypes = {
    toolTipText: PropTypes.string.isRequired,
  };

  handleShowToolTip() {
    const { showToolTip } = this.state;
    if (!showToolTip) {
      this.setState({
        showToolTip: true,
      });
    }
  }

  handleHideToolTip() {
    const { showToolTip } = this.state;
    if (showToolTip) {
      this.setState({
        showToolTip: false,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.refs.child) {
      const ignorePostRender = this.state.open === prevState.open;
      const { top, left }  = this.refs.child.getBoundingClientRect();
      if (!ignorePostRender || this.state.top !== top || this.state.left !== left) {
        this.setState({
          left,
          top
        });
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const nextLeft = nextState.left;
    const nextTop = nextState.top;
    const nextOpen = nextState.top;
    const { top, left, open } = this.state;

    if (nextOpen !== open) {
      return true;
    }

    if (left === nextLeft && top === nextTop) {
      return false;
    }

    console.log("returning true", left, nextLeft);

    return true;
  }

  render() {
    const { children, toolTipText, toolTipStyle } = this.props;
    const { showToolTip, top, left } = this.state;

    const defaultStyle = {
      background: '#595959',
      position: 'fixed',
      marginTop: 40,
      marginLeft: -20,
      top,
      left,
      padding: 5,
      fontSize: 12,
      zIndex: 999999,
      color: '#fff',
    };

    const appliedStyle = { ...defaultStyle, ...toolTipStyle };

    return (
      <div
        onMouseOver={this.handleShowToolTip.bind(this)}
        onMouseOut={this.handleHideToolTip.bind(this)}
      >
        <div ref="child">{children}</div>
        {showToolTip && <span style={appliedStyle}>{toolTipText}</span>}
      </div>
    );
  }
}

export default ToolTippable;
