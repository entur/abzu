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

import * as Limitations from "../models/Limitations";
import { getIn } from "../utils";

const LimitationHelpers = {};

LimitationHelpers.updateCurrentWithLimitations = (current, payLoad) => {
  const { limitationType, value } = payLoad;

  let copy = JSON.parse(JSON.stringify(current));

  copy = setLimitationForEntity(copy, limitationType, value);

  if (copy.quays) {
    copy.quays = copy.quays.map((quay) =>
      setLimitationForEntity(quay, limitationType, value)
    );
  }
  return copy;
};

LimitationHelpers.updateCurrentWithQuayLimitations = (current, payLoad) => {
  const { index, value, limitationType } = payLoad;
  let copy = JSON.parse(JSON.stringify(current));

  if (copy.quays && copy.quays[index]) {
    copy.quays[index] = setLimitationForEntity(
      copy.quays[index],
      limitationType,
      value
    );
    const correctLimitationValue = getLimitationForStopBasedOnQuays(
      copy.quays,
      limitationType
    );
    return setLimitationForEntity(copy, limitationType, correctLimitationValue);
  }

  return copy;
};

export const getAssessmentSetBasedOnQuays = (quays) => {
  const limitations = {};

  Object.keys(Limitations.defaultLimitations).forEach((limitation) => {
    let value = getLimitationForStopBasedOnQuays(quays, limitation);
    limitations[limitation] = value;
  });

  return { limitations: limitations };
};

const setLimitationForEntity = (source, limitationType, value) => {
  let entity = JSON.parse(JSON.stringify(source));

  if (
    !entity.accessibilityAssessment ||
    !entity.accessibilityAssessment.limitations
  ) {
    entity.accessibilityAssessment = {};
    entity.accessibilityAssessment.limitations = Limitations.defaultLimitations;
  }
  entity.accessibilityAssessment.limitations[limitationType] = value;
  return entity;
};

const getLimitationForStopBasedOnQuays = (quays, limitationType) => {
  if (!quays || !quays.length)
    return Limitations.defaultLimitations[limitationType];

  let isUnknown = false;
  let isPartial = false;
  let trueCount = 0;
  let falseCount = 0;

  quays.forEach((q) => {
    let limitation = getIn(
      q,
      ["accessibilityAssessment", "limitations", limitationType],
      null
    );

    if (limitation === Limitations.availableTypes.UNKNOWN) {
      isUnknown = true;
    } else if (limitation === Limitations.availableTypes.PARTIAL) {
      isPartial = true;
    } else if (limitation === Limitations.availableTypes.TRUE) {
      trueCount += 1;
    } else if (limitation === Limitations.availableTypes.FALSE) {
      falseCount += 1;
    }
  });

  if (isUnknown) return Limitations.availableTypes.UNKNOWN;

  if (isPartial) return Limitations.availableTypes.PARTIAL;

  if (trueCount === quays.length) return Limitations.availableTypes.TRUE;

  if (falseCount === quays.length) return Limitations.availableTypes.FALSE;

  if (trueCount > 0 && falseCount > 0)
    return Limitations.availableTypes.PARTIAL;

  return Limitations.availableTypes.UNKNOWN;
};

export default LimitationHelpers;
