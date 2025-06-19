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

import WheelChair from "@mui/icons-material/Accessible";
import { Component } from "react";
import { getPrimaryDarkerColor } from "../../config/themeConfig";
import { AccessibilityLimitationType } from "../../models/AccessibilityLimitation";
import { getIn } from "../../utils/";
import Code from "../EditStopPage/Code";
import BelongsToGroup from "./BelongsToGroup";
import CircularNumber from "./CircularNumber";
import HasExpiredInfo from "./HasExpiredInfo";
import ModalityIconImg from "./ModalityIconImg";
import TagTray from "./TagTray";

class StopPlaceResultInfo extends Component {
  render() {
    const { result, formatMessage } = this.props;
    const primaryDarker = getPrimaryDarkerColor();

    const hasWheelchairAccess =
      getIn(
        result,
        ["accessibilityAssessment", "limitations", "wheelchairAccess"],
        null,
      ) === AccessibilityLimitationType.TRUE;

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 0,
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 600 }}>{result.name}</div>
          <ModalityIconImg
            submode={result.submode}
            type={result.stopPlaceType}
          />
        </div>
        <HasExpiredInfo show={result.hasExpired} />
        <div
          style={{ display: "flex", flexDirection: "column", marginLeft: 10 }}
        >
          {result.topographicPlace && result.parentTopographicPlace && (
            <div style={{ fontSize: 18 }}>
              {`${result.topographicPlace}, ${result.parentTopographicPlace}`}
            </div>
          )}
          {result.belongsToGroup && (
            <BelongsToGroup
              formatMessage={formatMessage}
              groups={result.groups}
            />
          )}
          <div style={{ fontSize: 14 }}>{result.id}</div>
        </div>
        <div style={{ display: "block", fontSize: 10, marginLeft: 10 }}>
          <span style={{ fontWeight: 600, marginRight: 5 }}>
            {formatMessage({ id: "local_reference" })}
          </span>
          {result.importedId ? result.importedId.join(", ") : ""}
        </div>
        <TagTray tags={result.tags} style={{ marginLeft: 10 }} />
        <div style={{ display: "flex", justifyItems: "center", padding: 10 }}>
          <div style={{ fontSize: 16, textTransform: "capitalize" }}>
            {formatMessage({ id: "quays" })}
          </div>
          <div style={{ marginLeft: 5 }}>
            <CircularNumber
              number={result.quays.length}
              color={primaryDarker}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 10,
            maxHeight: 120,
            overflow: "auto",
            width: "95%",
            margin: "0px auto 20px auto",
          }}
        >
          {result.quays.map((quay, i) => (
            <div
              key={"quayId" + quay.id}
              style={{
                borderBottom: "1px solid #0078a8",
                background: i % 2 ? "#f8f8f8" : "#fff",
                padding: 2,
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {quay.id}
                <Code
                  type="publicCode"
                  value={quay.publicCode}
                  defaultValue={formatMessage({ id: "not_assigned" })}
                />
                <Code
                  type="privateCode"
                  value={quay.privateCode ? quay.privateCode.value : ""}
                  defaultValue={formatMessage({ id: "not_assigned" })}
                />
              </div>
              {quay.importedId ? quay.importedId.join(", ") : ""}
            </div>
          ))}
        </div>
        {hasWheelchairAccess ? (
          <div
            style={{
              display: "flex",
              marginLeft: 5,
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <WheelChair color={primaryDarker} />
            <span style={{ marginLeft: 5 }}>
              {formatMessage({ id: "wheelchairAccess" })}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}

export default StopPlaceResultInfo;
