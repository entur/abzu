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

export const REPORTS_ROUTE = `/${AppRoutes.REPORTS}`;

/**
 * True while the Reports page is showing. Reads the router's location, which
 * has the deployment base path removed, so it holds under any base path.
 * Must run inside <Router>.
 */
export const useIsReportsRoute = (): boolean =>
  useMatch(REPORTS_ROUTE) !== null;
