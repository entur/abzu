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
import { getIconByTypeOrSubmode } from "../../utils/iconUtils";

const CustomMarkerIcon = ({
  stopType,
  active,
  hasExpired,
  submode,
  isMultimodal,
  isMultimodalChild,
}) => {
  let imageStyle = {
    padding: 3,
    background: "#0060b9",
    borderRadius: "50%",
  };

  if (!active) {
    imageStyle.opacity = hasExpired ? "0.5" : "1.0";
    imageStyle.filter = isMultimodalChild ? "grayscale(60%)" : "grayscale(80%)";
  }

  const icon = getIconByTypeOrSubmode(submode, stopType, isMultimodal);

  const stopTypeIcon = (
    <img alt="" style={{ width: 20, height: 20, ...imageStyle }} src={icon} />
  );

  return <div>{stopTypeIcon}</div>;
};

export default CustomMarkerIcon;
