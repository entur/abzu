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

import {
  AccessibilityLimitationType,
  defaultLimitations,
} from "../models/AccessibilityLimitation";
import { getIn } from "../utils";

const LimitationHelpers = {};

LimitationHelpers.updateCurrentWithLimitations = (current, payload) => {
  const { limitationType, value } = payload;

  let copy = JSON.parse(JSON.stringify(current));

  copy = setLimitationForEntity(copy, limitationType, value);

  if (copy.quays) {
    copy.quays = copy.quays.map((quay) =>
      setLimitationForEntity(quay, limitationType, value),
    );
  }
  return copy;
};

LimitationHelpers.updateCurrentWithQuayLimitations = (current, payload) => {
  const { index, value, limitationType } = payload;
  let copy = JSON.parse(JSON.stringify(current));

  if (copy.quays && copy.quays[index]) {
    copy.quays[index] = setLimitationForEntity(
      copy.quays[index],
      limitationType,
      value,
    );
    const correctLimitationValue = getLimitationForStopBasedOnQuays(
      copy.quays,
      limitationType,
    );
    return setLimitationForEntity(copy, limitationType, correctLimitationValue);
  }

  return copy;
};

export const getAssessmentSetBasedOnQuays = (quays) => {
  const limitations = {};

  Object.keys(defaultLimitations).forEach((limitation) => {
    let value = getLimitationForStopBasedOnQuays(quays, limitation);
    limitations[limitation] = value;
  });

  return { limitations: limitations };
};

export const setLimitationForEntity = (source, limitationType, value) => {
  let entity = JSON.parse(JSON.stringify(source));

  if (
    !entity.accessibilityAssessment ||
    !entity.accessibilityAssessment.limitations
  ) {
    entity.accessibilityAssessment = {};
    entity.accessibilityAssessment.limitations = defaultLimitations;
  }
  entity.accessibilityAssessment.limitations[limitationType] = value;
  return entity;
};

const getLimitationForStopBasedOnQuays = (quays, limitationType) => {
  if (!quays || !quays.length) return defaultLimitations[limitationType];

  let isUnknown = false;
  let isPartial = false;
  let trueCount = 0;
  let falseCount = 0;

  quays.forEach((q) => {
    let limitation = getIn(
      q,
      ["accessibilityAssessment", "limitations", limitationType],
      null,
    );

    if (limitation === AccessibilityLimitationType.UNKNOWN) {
      isUnknown = true;
    } else if (limitation === AccessibilityLimitationType.PARTIAL) {
      isPartial = true;
    } else if (limitation === AccessibilityLimitationType.TRUE) {
      trueCount += 1;
    } else if (limitation === AccessibilityLimitationType.FALSE) {
      falseCount += 1;
    }
  });

  if (isUnknown) return AccessibilityLimitationType.UNKNOWN;

  if (isPartial) return AccessibilityLimitationType.PARTIAL;

  if (trueCount === quays.length) return AccessibilityLimitationType.TRUE;

  if (falseCount === quays.length) return AccessibilityLimitationType.FALSE;

  if (trueCount > 0 && falseCount > 0)
    return AccessibilityLimitationType.PARTIAL;

  return AccessibilityLimitationType.UNKNOWN;
};

export default LimitationHelpers;
