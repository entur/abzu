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

import { useAppSelector } from "../../../../store/hooks";
import { isElementStatusVariant } from "./types";

/**
 * Whether the dirty-dot affordance is switched on. Ghost rows for staged
 * deletions ignore this — a removed row must stay visible either way.
 */
export const useElementStatusEnabled = (): boolean => {
  const selected = useAppSelector(
    (state) => (state.user as any)?.elementStatusDisplay as unknown,
  );

  return isElementStatusVariant(selected) && selected !== "off";
};
