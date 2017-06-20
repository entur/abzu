import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import ModalityIcon from './ModalityIcon';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

class ModalitiesMenuItems extends React.Component {
  render() {

    const { stopTypes, handleStopTypeChange, handleSubModeTypeChange } = this.props;

    return (
      <div>
      {stopTypes.map((type, index) =>
        <MenuItem
          key={'stopType' + index}
          value={type.value}
          style={{ padding: '0px 10px' }}
          primaryText={type.name}
          onTouchTap={() => {
            !type.submodes && handleStopTypeChange(type.value);
          }}
          insetChildren={true}
          rightIcon={type.submodes && <ArrowDropRight/> }
          leftIcon={
            <ModalityIcon
              iconStyle={{ float: 'left' }}
              type={type.value}
            />
          }
          menuItems={type.submodes && type.submodes.map( (submode,i) => (
            <MenuItem
              key={'stopType-sub' + submode.value + '-' + index}
              value={submode.value}
              style={{ padding: '0px 10px' }}
              primaryText={submode.name}
              onClick={() => {
                handleSubModeTypeChange(type.value, type.transportMode, submode.value);
              }}
              leftIcon={
                <ModalityIcon
                  iconStyle={{ float: 'left' }}
                  type={type.value}
                  submode={submode.value}
                />
              }
              insetChildren={true}
            />
          ))}
        />
      )}
      </div>
    )
  }
}

export default ModalitiesMenuItems;