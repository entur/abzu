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

import React from "react";
import MenuItem from "@mui/material/MenuItem";
import ModalityIconSvg from "../MainPage/ModalityIconSvg";
import ArrowDropRight from "@mui/icons-material/ArrowRight";
import {
  getStopPlacesForSubmodes,
  getInverseSubmodesWhitelist,
} from "../../roles/rolesParser";
import Menu from "@mui/material/Menu";

class ModalitiesMenuItems extends React.Component {
  render() {
    const {
      intl: { formatMessage },
      stopTypes,
      handleStopTypeChange,
      handleSubModeTypeChange,
      allowsInfo,
      stopPlaceTypeChosen,
      submodeChosen,
    } = this.props;

    const legalStopPlaceTypes = allowsInfo.legalStopPlaceTypes || [];
    const legalSubmodes = allowsInfo.legalSubmodes || [];
    const blacklistedStopTypes = allowsInfo.blacklistedStopPlaceTypes || [];
    const illegalSubmodes = getInverseSubmodesWhitelist(legalSubmodes);
    // stopPlacesTypes that submodes are depending on to be legal in order to render
    const adHocStopPlaceTypes = getStopPlacesForSubmodes(legalSubmodes);
    const chosenStyle = { fontWeight: 600 };

    return (
      <Menu open="true">

        {Object.keys(stopTypes).map((type, index) => {
          let isLegal =
            adHocStopPlaceTypes.indexOf(type) > -1 ||
            legalStopPlaceTypes.indexOf(type) > -1;

          if (blacklistedStopTypes.indexOf(type) > -1) {
            isLegal = false;
          }

          const stopTypeMatchingChosen = stopPlaceTypeChosen === type;
          const transportMode = stopTypes[type].transportMode;
          let submodes = stopTypes[type].submodes;

          if (submodes) {
            // Add "unspeficied" submode option, corresponding to null value,
            // and sort according to the localized formatted version, with
            // unspecified always on top
            submodes = [null]
              .concat(submodes)
              .map((submode) => {
                return {
                  submode,
                  formatted: formatMessage({
                    id: `stopTypes.${type}.submodes.${
                      submode || "unspecified"
                    }`,
                  }),
                };
              })
              .sort((a, b) => {
                if (a.submode === null) return -1;
                if (b.submode === null) return 1;
                if (a.formatted < b.formatted) return -1;
                if (a.formatted > b.formatted) return 1;
                return 0;
              });
          }

          return (
            <MenuItem
              key={"stopType" + index}
              className={isLegal ? "" : "menu-item--not-legal"}
              value={type}
              style={{ padding: "0px 10px" }}
              primaryText={
                <span
                  style={stopTypeMatchingChosen && !submodes ? chosenStyle : {}}
                >
                  {formatMessage({ id: `stopTypes.${type}.name` })}
                </span>
              }
              onClick={() => {
                !submodes && handleStopTypeChange(type);
              }}
              insetChildren={true}
              rightIcon={submodes && <ArrowDropRight />}
              leftIcon={
                <ModalityIconSvg iconStyle={{ float: "left" }} type={type} />
              }
              menuItems={
                submodes &&
                submodes.map(({ submode, formatted }) => {
                  // make all submodes legal if stopPlace is legal
                  let isLegal =
                    illegalSubmodes.indexOf(submode) !== -1 &&
                    adHocStopPlaceTypes.indexOf(type) === -1;

                  const isLegalStopPlaceType =
                    legalStopPlaceTypes.indexOf(type) > -1;
                  // if stopPlace is allowed, not specific item should be legal
                  if (submode == null && isLegalStopPlaceType) {
                    isLegal = true;
                  }

                  // if submode is whitelisted
                  if (legalSubmodes.indexOf(submode) > -1) {
                    isLegal = true;
                  }

                  const isMatchingChosen =
                    stopTypeMatchingChosen && submode === submodeChosen;

                  return (
                    <MenuItem
                      key={"stopType-sub" + submode + "-" + index}
                      value={submode}
                      className={isLegal ? "" : "menu-item--not-legal"}
                      style={{ padding: "0px 10px" }}
                      primaryText={
                        <span style={isMatchingChosen ? chosenStyle : {}}>
                          {formatted}
                        </span>
                      }
                      onClick={() => {
                        handleSubModeTypeChange(type, transportMode, submode);
                      }}
                      leftIcon={
                        <ModalityIconSvg
                          iconStyle={{ float: "left" }}
                          type={type}
                          submode={submode}
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

export default ModalitiesMenuItems;
