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

export enum AccessibilityLimitationType {
  TRUE = "TRUE",
  FALSE = "FALSE",
  UNKNOWN = "UNKNOWN",
  PARTIAL = "PARTIAL",
}

export enum AccessibilityLimitation {
  WHEELCHAIR_ACCESS = "wheelchairAccess",
  STEP_FREE_ACCESS = "stepFreeAccess",
  AUDIBLE_SIGNALS_AVAILABLE = "audibleSignalsAvailable",
  VISUAL_SIGNS_AVAILABLE = "visualSignsAvailable",
  ESCALATOR_FREE_ACCESS = "escalatorFreeAccess",
  LIFT_FREE_ACCESS = "liftFreeAccess",
}

export const defaultLimitations: Record<
  AccessibilityLimitation,
  AccessibilityLimitationType
> = {
  wheelchairAccess: AccessibilityLimitationType.UNKNOWN,
  stepFreeAccess: AccessibilityLimitationType.UNKNOWN,
  escalatorFreeAccess: AccessibilityLimitationType.UNKNOWN,
  liftFreeAccess: AccessibilityLimitationType.UNKNOWN,
  audibleSignalsAvailable: AccessibilityLimitationType.UNKNOWN,
  visualSignsAvailable: AccessibilityLimitationType.UNKNOWN,
};
