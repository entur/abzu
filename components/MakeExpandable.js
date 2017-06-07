import React from 'react';
import MdExpand from 'material-ui/svg-icons/navigation/expand-more';
import MdCollapse from 'material-ui/svg-icons/navigation/expand-less';
import IconButton from 'material-ui/IconButton';

class MakeExpandable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleToggle() {
    this.setState(prevState => {
      return { expanded: !prevState.expanded };
    });
  }

  render() {
    let expandButtonStyle = {
      display: 'block',
      width: '100%',
      textAlign: 'center'
    };

    let iconButtonStyle = {
      flexBasis: '100%',
      textAlign: 'right',
      marginBottom: 5,
      marginTop: -10,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontSize: 12
    };

    if (this.props.style.background) {
      expandButtonStyle.background = this.props.style.background;
    }

    return (
      <div>
        <div style={this.props.style}>
          {this.props.children}
          <div style={iconButtonStyle}>
            <IconButton onTouchTap={this.handleToggle.bind(this)}>
              {this.state.expanded ? <MdCollapse /> : <MdExpand />}
            </IconButton>
          </div>
        </div>
        {this.state.expanded && this.props.expandedContent}
      </div>
    );
  }
}

export default MakeExpandable;
