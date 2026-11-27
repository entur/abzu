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

import { addItemButtonSx } from "../../../Shared";

export const FAB_SIZE = 56;
export const FAB_TOP = 16;

/** The + itself: paper with a semantic icon colour, warning while placing. */
export const addElementFabSx = (isPlacing: boolean) => ({
  ...addItemButtonSx(isPlacing ? "warning.main" : "primary.main"),
  // Floats over the map, so it needs more lift than an in-panel button.
  boxShadow: 3,
});
