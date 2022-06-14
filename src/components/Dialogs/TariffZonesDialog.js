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
import { connect } from "react-redux";
import DialogHeader from "./DialogHeader";
import TariffZonesItem from "./TariffZonesItem";

class TariffZonesDialog extends React.Component {
  render() {
    const {
      open,
      intl,
      tariffZones = [],
      fareZones = [],
      handleClose,
    } = this.props;
    const { formatMessage } = intl;

    const translations = {
      value: formatMessage({ id: "name" }),
      tariffZones: formatMessage({ id: "tariffZones" }),
      noTariffZones: formatMessage({ id: "noTariffZones" }),
      tariffZonesDeprecated: formatMessage({ id: "tariffZonesDeprecated" }),
    };

    if (!open) return null;

    const style = {
      position: "fixed",
      left: 400,
      top: 190,
      background: "#fff",
      border: "1px solid black",
      width: 350,
      zIndex: 999,
    };

    const noItemsStyle = {
      width: "100%",
      textAlign: "center",
      marginBottom: 10,
      fontSize: 12,
    };

    return (
      <div style={style}>
        <DialogHeader
          title={translations.tariffZones}
          handleClose={handleClose}
        />
        <div
          style={{
            width: "100%",
            fontSize: 14,
            maxHeight: 400,
            marginLeft: 5,
            marginBottom: 5,
          }}
        >
          {tariffZones.length || fareZones.length ? (
            <>
              <div
                style={{
                  width: "100%",
                  fontSize: 12,
                  overflowY: "overlay",
                  maxHeight: 400,
                }}
              >
                {tariffZones.map((tz) => (
                  <TariffZonesItem
                    key={"tariffZone-" + tz.id}
                    id={tz.id}
                    name={tz.name}
                  />
                ))}
              </div>
              <div
                style={{
                  width: "100%",
                  fontSize: 12,
                  overflowY: "overlay",
                  maxHeight: 400,
                }}
              >
                {fareZones.map((fz) => (
                  <TariffZonesItem
                    key={"fareZone-" + fz.id}
                    id={fz.id}
                    name={fz.name}
                    privateCode={fz.privateCode}
                  />
                ))}
              </div>
            </>
          ) : (
            <div style={noItemsStyle}>{translations.noTariffZones}</div>
          )}
        </div>
      </div>
    );
  }
}

export default connect(null)(TariffZonesDialog);
