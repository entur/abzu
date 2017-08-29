import { setDecimalPrecision } from '../utils/';
import { getImportedId } from './StopPlaceUtils';

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
      description: quay.description ? quay.description.value : ''
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

    if (quay.geometry && quay.geometry.coordinates) {
      let coordinates = quay.geometry.coordinates[0].slice();

      clientQuay.location = [
        setDecimalPrecision(coordinates[1], 6),
        setDecimalPrecision(coordinates[0], 6)
      ];
    }

    if (quay.placeEquipments) {
      clientQuay.placeEquipments = quay.placeEquipments;
    }

    return clientQuay;
  }
}

export default Quay;
