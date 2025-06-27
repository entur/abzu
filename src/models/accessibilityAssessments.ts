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
  AccessibilityLimitation,
  AccessibilityLimitationType,
} from "./AccessibilityLimitation";

export interface AccessibilityLimitationMenu {
  options: AccessibilityLimitationType[];
}

export const accessibilityAssessmentColors: Record<
  AccessibilityLimitationType,
  string
> = {
  TRUE: "#181C56",
  FALSE: "#F44336",
  UNKNOWN: "#e8e3e3",
  PARTIAL: "#FF9800",
};

export const accessibilityAssessments: Record<
  AccessibilityLimitation,
  AccessibilityLimitationMenu
> = {
  wheelchairAccess: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
  stepFreeAccess: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
  audibleSignalsAvailable: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
  visualSignsAvailable: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
  escalatorFreeAccess: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
  liftFreeAccess: {
    options: [
      AccessibilityLimitationType.TRUE,
      AccessibilityLimitationType.FALSE,
      AccessibilityLimitationType.UNKNOWN,
    ],
  },
};
