import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ModalityIcon from '../MainPage/ModalityIcon';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import { getStopPlacesForSubmodes, getInverseSubmodesWhitelist } from '../../roles/rolesParser';

class ModalitiesMenuItems extends React.Component {
  render() {

    const { stopTypes, handleStopTypeChange, handleSubModeTypeChange, allowsInfo } = this.props;

    const legalStopPlaceTypes = allowsInfo.legalStopPlaceTypes || [];
    const legalSubmodes = allowsInfo.legalSubmodes|| [];
    const illegalSubmodes = getInverseSubmodesWhitelist(legalSubmodes);
    // stopPlacesTypes that submodes are depending on to be legal in order to render
    const adHocStopPlaceTypes = getStopPlacesForSubmodes(legalSubmodes);

    return (
      <div>
      {stopTypes.map((type, index) => {

        let isLegal = adHocStopPlaceTypes.indexOf(type.value) > -1 || legalStopPlaceTypes.indexOf(type.value) > -1;

        return (
          <MenuItem
            key={'stopType' + index}
            className={isLegal ? '' : 'menu-item--not-legal'}
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

              // make all submodes legal if stopPlace is legal
              let isLegal = (illegalSubmodes.indexOf(submode.value) !== -1 && adHocStopPlaceTypes.indexOf(type.value) === -1);

              const isLegalStopPlaceType = legalStopPlaceTypes.indexOf(type.value) > -1
              // if stopPlace is allowed, not specific item should be legal
              if (submode.value == null && isLegalStopPlaceType) {
                isLegal = true;
              }

              // if submode is whitelisted
              if (legalSubmodes.indexOf(submode.value) > -1) {
                isLegal = true;
              }

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
        )
      }
      )}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  allowsInfo: state.roles.allowanceInfo
})

export default connect(mapStateToProps)(ModalitiesMenuItems);