import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ModalityIcon from './ModalityIcon';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';

class ModalitiesMenuItems extends React.Component {
  render() {

    const { stopTypes, handleStopTypeChange, handleSubModeTypeChange, allowsInfo } = this.props;

    const legalStopPlaceTypes = allowsInfo.legalStopPlaceTypes || [];
    const legalSubmodes = allowsInfo.legalSubmodes|| [];

    return (
      <div>
      {stopTypes.map((type, index) =>
        <MenuItem
          key={'stopType' + index}
          className={legalStopPlaceTypes.indexOf(type.value) > -1 ? '' : 'menu-item--not-legal'}
          value={type.value}
          style={{ padding: '0px 10px'}}
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
          menuItems={type.submodes && type.submodes.map( submode => {

            const isLegal = (legalSubmodes.indexOf(submode.value) > -1 || submode.value == null)

            return (
              <MenuItem
                key={'stopType-sub' + submode.value + '-' + index}
                value={submode.value}
                className={isLegal ? '' : 'menu-item--not-legal'}
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
            )
          })}
        />
      )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  allowsInfo: state.roles.allowanceInfo
})

export default connect(mapStateToProps)(ModalitiesMenuItems);