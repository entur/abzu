/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
the European Commission - subsequent versions of the EUPL (the "Licence");
You may not use this work except in compliance with the Licence.
You may obtain a copy of the Licence at:

  https://joinup.ec.europa.eu/software/page/eupl

Unless required by applicable law or agreed to in writing, software
distributed under the Licence is distributed on an "AS IS" basis,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the Licence for the specific language governing permissions and
limitations under the Licence. */


import React from 'react';
import { connect } from 'react-redux';
import MenuItem from 'material-ui/MenuItem';
import ModalityIconSvg from '../MainPage/ModalityIconSvg';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import {
  getStopPlacesForSubmodes,
  getInverseSubmodesWhitelist
} from '../../roles/rolesParser';
import Menu from 'material-ui/Menu';

class ModalitiesMenuItems extends React.Component {
  render() {
    const {
      stopTypes,
      handleStopTypeChange,
      handleSubModeTypeChange,
      allowsInfo,
      stopPlaceTypeChosen,
      submodeChosen
    } = this.props;

    const legalStopPlaceTypes = allowsInfo.legalStopPlaceTypes || [];
    const legalSubmodes = allowsInfo.legalSubmodes || [];
    const blacklistedStopTypes = allowsInfo.blacklistedStopPlaceTypes || [];
    const illegalSubmodes = getInverseSubmodesWhitelist(legalSubmodes);
    // stopPlacesTypes that submodes are depending on to be legal in order to render
    const adHocStopPlaceTypes = getStopPlacesForSubmodes(legalSubmodes);
    const chosenStyle = { fontWeight: 600 };

    return (
      <Menu>

        {stopTypes.map((type, index) => {
          let isLegal =
            adHocStopPlaceTypes.indexOf(type.value) > -1 ||
            legalStopPlaceTypes.indexOf(type.value) > -1;

          if (blacklistedStopTypes.indexOf(type.value) > -1) {
            isLegal = false;
          }

          const stopTypeMatchingChosen = stopPlaceTypeChosen === type.value;

          return (
            <MenuItem
              key={'stopType' + index}
              className={isLegal ? '' : 'menu-item--not-legal'}
              value={type.value}
              style={{ padding: '0px 10px' }}
              primaryText={
                <span
                  style={
                    stopTypeMatchingChosen && !type.submodes ? chosenStyle : {}
                  }
                >
                  {type.name}
                </span>
              }
              onClick={() => {
                !type.submodes && handleStopTypeChange(type.value);
              }}
              insetChildren={true}
              rightIcon={type.submodes && <ArrowDropRight />}
              leftIcon={
                <ModalityIconSvg iconStyle={{ float: 'left' }} type={type.value} />
              }
              menuItems={
                type.submodes &&
                type.submodes.map(submode => {
                  // make all submodes legal if stopPlace is legal
                  let isLegal =
                    illegalSubmodes.indexOf(submode.value) !== -1 &&
                    adHocStopPlaceTypes.indexOf(type.value) === -1;

                  const isLegalStopPlaceType =
                    legalStopPlaceTypes.indexOf(type.value) > -1;
                  // if stopPlace is allowed, not specific item should be legal
                  if (submode.value == null && isLegalStopPlaceType) {
                    isLegal = true;
                  }

                  // if submode is whitelisted
                  if (legalSubmodes.indexOf(submode.value) > -1) {
                    isLegal = true;
                  }

                  const isMatchingChosen =
                    stopTypeMatchingChosen && submode.value === submodeChosen;

                  return (
                    <MenuItem
                      key={'stopType-sub' + submode.value + '-' + index}
                      value={submode.value}
                      className={isLegal ? '' : 'menu-item--not-legal'}
                      style={{ padding: '0px 10px' }}
                      primaryText={
                        <span style={isMatchingChosen ? chosenStyle : {}}>
                          {submode.name}
                        </span>
                      }
                      onClick={() => {
                        handleSubModeTypeChange(
                          type.value,
                          type.transportMode,
                          submode.value
                        );
                      }}
                      leftIcon={
                        <ModalityIconSvg
                          iconStyle={{ float: 'left' }}
                          type={type.value}
                          submode={submode.value}
                        />
                      }
                      insetChildren={true}
                    />
                  );
                })
              }
            />
          );
        })}
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  allowsInfo: state.roles.allowanceInfo
});

export default connect(mapStateToProps)(ModalitiesMenuItems);
