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

import { setDecimalPrecision } from "../utils/";
import {
  getImportedId,
  simplifyBoardingPositions,
  simplifyPlaceEquipment,
} from "./stopPlaceUtils";

class Quay {
  constructor(quay, accessibilityAssessment) {
    this.quay = quay;
    this.accessibilityAssessment = accessibilityAssessment;
  }

  toClient() {
    const { quay, accessibilityAssessment } = this;

    const clientQuay = {
      id: quay.id,
      compassBearing: quay.compassBearing,
      publicCode: quay.publicCode,
      description: quay.description ? quay.description.value : "",
      boardingPositions: simplifyBoardingPositions(quay.boardingPositions),
    };

    clientQuay.accessibilityAssessment =
      quay.accessibilityAssessment || accessibilityAssessment;

    if (quay.keyValues) {
      clientQuay.importedId = getImportedId(quay.keyValues);
      clientQuay.keyValues = quay.keyValues;
    }

    if (quay.privateCode && quay.privateCode.value) {
      clientQuay.privateCode = quay.privateCode.value;
    }

    if (quay.geometry && quay.geometry.legacyCoordinates) {
      let coordinates = quay.geometry.legacyCoordinates[0].slice();

      clientQuay.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6),
      ];
    }

    if (quay.placeEquipments) {
      clientQuay.placeEquipments = simplifyPlaceEquipment(quay.placeEquipments);
    }

    if (quay.facilities) {
      clientQuay.facilities = [...quay.facilities];
    }

    return clientQuay;
  }
}

export default Quay;
