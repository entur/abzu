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

import { useMatch } from "react-router-dom";
import AppRoutes from "../../../../routes";

/**
 * True while a group of stop places is open in the editor.
 *
 * **Read from the route, not from Redux, on purpose.**
 * `stopPlacesGroup.current` outlives the group: `groupOfStopPlacesReducer`
 * clears it on `NAVIGATE_TO` only when the payload is `""`, and
 * `UserActions.navigateTo(path, id)` sends *just the id*. So navigating to the
 * main page clears it, but opening a stop place — payload is that stop's id —
 * leaves the whole group sitting in state.
 *
 * The map is mounted once and never torn down between routes, so a layer that
 * trusts that state keeps drawing the group's polygon and edges over an
 * unrelated stop place until the page is reloaded.
 *
 * Fixing the reducer instead would mean clearing on any non-empty payload,
 * which would also fire when navigating *into* a group and break the
 * create-new-group flow — the action carries no destination path to
 * distinguish them. The route always knows.
 */
export const useIsEditingGroup = (): boolean =>
  Boolean(useMatch(`/${AppRoutes.GROUP_OF_STOP_PLACE}/:groupId`));
