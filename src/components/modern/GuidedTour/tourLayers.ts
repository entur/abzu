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

import type { Theme } from "@mui/material";

/**
 * The panel stays above the app's own dialogs, so the instructions remain in
 * view while the tester works in one. The tour's own popups (step list,
 * dialogs) go one layer higher still, or they would open behind the panel.
 */
export const tourPanelZIndex = (theme: Theme): number => theme.zIndex.modal + 1;
export const tourPopupZIndex = (theme: Theme): number => theme.zIndex.modal + 2;
