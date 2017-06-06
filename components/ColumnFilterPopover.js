import React from 'react';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import RaisedButton from 'material-ui/RaisedButton';
import Menu from 'material-ui/Menu';
import Checkbox from 'material-ui/Checkbox';
import { ColumnTranslations } from '../models/columnTransformers';

class ColumnFilterPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      anchorEl: event.currentTarget,
      open: true,
    });
  }

  render() {
    const { columnOptions, label, locale } = this.props;
    const optionStyle = {
      padding: 5,
    };

    return (
      <div style={this.props.style}>
        <RaisedButton
          label={label}
          onTouchTap={this.handleTouchTap.bind(this)}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={() => {
            this.setState({ open: false });
          }}
          animation={PopoverAnimationVertical}
        >
          <Menu>
            {columnOptions.map(option =>
              <div style={optionStyle} key={'option-' + option.id}>
                <Checkbox
                  label={ColumnTranslations[locale][option.id]}
                  checked={option.checked}
                  onCheck={(e, checked) => {
                    this.props.handleColumnCheck(option.id, checked);
                  }}
                />
              </div>,
            )}
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default ColumnFilterPopover;
