import React from 'react';
import { injectIntl } from 'react-intl';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import EvStation from 'material-ui/svg-icons/maps/ev-station';
import { colors as rechargingAvailableColors } from '../../models/rechargingAvailable';
import { Popover, PopoverAnimationVertical } from 'material-ui/Popover';

class RechargingAvailablePopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      anchorEl: null,
    };
  }

  handleChange(value) {
    this.setState({
      open: false,
    });
    this.props.handleChange(value);
  }

  handleOpenPopover(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleClosePopover() {
    this.setState({
      open: false,
    });
  }

  handleSelect(value) {
    this.props.handleSetRechargingAvailable(value);
    this.props.handleSetNumberOfSpacesWithRechargePoint(0);
    this.setState({
      open: false
    });
  }

  render() {
    const {
      intl: {formatMessage},
      disabled,
      hasExpired,
      rechargingAvailableValue
    } = this.props;

    const { open, anchorEl } = this.state;

    const evStationIconColor = rechargingAvailable => {
      if (rechargingAvailable === null) return rechargingAvailableColors.UNKNOWN;
      return rechargingAvailable ? rechargingAvailableColors.RECHARGING_AVAILABLE : rechargingAvailableColors.RECHARGING_NOT_AVAILABLE;
    }

    const rechargingAvailableMenuItems = [true, false].map(key => (
      <MenuItem
        leftIcon={<EvStation color={evStationIconColor(key)} />}
        key={`rechargingAvailable_${key}`}
        value={key}
        primaryText={formatMessage({ id: `parking_recharging_available_${key}`} )}
        onClick={() => this.handleSelect(key)} />
    ));

    return (
      <div>
        <div
          style={{ margin: '6px 6px 0 0', height: '56px' }}
        >
          <IconButton
            style={{ borderBottom: disabled || hasExpired  ? 'none' : '1px dotted grey' }}
            onClick={e => {
              if (!disabled && !hasExpired) this.handleOpenPopover(e);
            }}
          >
            <EvStation
              color={evStationIconColor(rechargingAvailableValue)}
            />
          </IconButton>
        </div>
        <Popover
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleClosePopover.bind(this)}
          animation={PopoverAnimationVertical}
        >
          {rechargingAvailableMenuItems}
        </Popover>
      </div>
    );
  }
}

export default injectIntl(RechargingAvailablePopover);
