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

const boardingPositionIcon = require("../../static/icons/pin-50x82-purple.png")
  .default;

const imageStyle: React.CSSProperties = {
  padding: 3,
  borderRadius: "50%",
  width: "18px",
  height: "30px",
};

const labelStyle: React.CSSProperties = {
  color: "#fff",
  position: "absolute",
  top: 4,
  left: -3,
  zIndex: 9999,
};

type Props = {
  publicCode: string;
};

export default ({ publicCode }: Props) => {
  const nameLen = publicCode.length;

  return (
    <div>
      <img alt="" style={imageStyle} src={boardingPositionIcon} />
      <div style={labelStyle}>
        <div
          style={{
            width: 30,
            fontSize: nameLen > 2 ? 10 : 12,
            textAlign: "center",
          }}
        >
          {publicCode}
        </div>
      </div>
    </div>
  );
};
