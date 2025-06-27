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
import ModalityTray from "../ReportPage/ModalityIconTray";
import StopPlaceLink from "../ReportPage/StopPlaceLink";
import BelongsToGroup from "./BelongsToGroup";
import CircularNumber from "./CircularNumber";
import HasExpiredInfo from "./HasExpiredInfo";
import ModalityIconImg from "./ModalityIconImg";
import TagTray from "./TagTray";

class ParentStopPlaceResultInfo extends Component {
  render() {
    const { result, formatMessage } = this.props;

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
          <div>
            <ModalityTray
              modalities={result.children.map((child) => ({
                submode: child.submode,
                stopPlaceType: child.stopPlaceType,
              }))}
            />
          </div>
        </div>
        <HasExpiredInfo show={result.hasExpired} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {result.topographicPlace && result.parentTopographicPlace && (
              <div
                style={{ fontSize: 18, marginLeft: 5 }}
              >{`${result.topographicPlace}, ${result.parentTopographicPlace}`}</div>
            )}
            <div style={{ marginRight: 5 }}>
              {formatMessage({ id: "multimodal" })}
            </div>
          </div>
          <div style={{ fontSize: 14, marginLeft: 5 }}>{result.id}</div>
        </div>
        <div style={{ marginLeft: 5 }}>
          {result.belongsToGroup && (
            <BelongsToGroup
              formatMessage={formatMessage}
              groups={result.groups}
            />
          )}
        </div>
        <div style={{ display: "block", fontSize: 10, marginLeft: 5 }}>
          <span style={{ fontWeight: 600 }}>
            {result.importedId &&
              !!result.importedId.length &&
              formatMessage({ id: "local_reference" })}
          </span>
          {result.importedId &&
            !!result.importedId.length &&
            result.importedId.join(", ")}
        </div>
        <TagTray tags={result.tags} style={{ marginLeft: 5 }} />
        <div
          style={{
            display: "flex",
            justifyItems: "center",
            padding: "10px 5px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 16, textTransform: "capitalize" }}>
            {formatMessage({ id: "stop_places" })}
          </div>
          <div style={{ marginLeft: 5 }}>
            <CircularNumber
              number={result.children.length}
              color={getPrimaryDarkerColor()}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 10,
            maxHeight: 150,
            overflow: "auto",
            width: "95%",
            margin: "0px auto 20px auto",
          }}
        >
          {result.children.map((childStopPlace, i) => (
            <div
              key={"q-importedID" + childStopPlace.id}
              style={{
                borderBottom: "1px solid #0078a8",
                background: i % 2 ? "#f8f8f8" : "#fff",
                padding: 2,
                marginBottom: 5,
              }}
            >
              <div style={{ display: "flex", fontSize: "0.8rem" }}>
                <ModalityIconImg
                  type={childStopPlace.stopPlaceType}
                  submode={childStopPlace.submode}
                  svgStyle={{ transform: "scale(0.8)" }}
                  style={{ marginTop: -8, marginRight: 5 }}
                />
                <div>{childStopPlace.name}</div>
                <div style={{ marginLeft: 5 }}>
                  <StopPlaceLink id={childStopPlace.id} />
                </div>
              </div>
              <div style={{ fontWeight: 600 }}>
                {formatMessage({ id: "local_reference" }).replace(":", "")}
              </div>
              {childStopPlace.importedId
                ? childStopPlace.importedId.join(", ")
                : ""}
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
            <WheelChair color="#0097a7" />
            <span style={{ marginLeft: 5 }}>
              {formatMessage({ id: "wheelchairAccess" })}
            </span>
          </div>
        ) : null}
      </div>
    );
  }
}

export default ParentStopPlaceResultInfo;
