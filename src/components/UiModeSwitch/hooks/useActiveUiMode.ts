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

import { SwitchableUiMode, useConfig } from "../../../config/ConfigContext";
import { useAppSelector } from "../../../store/hooks";

const FALLBACK_UI_MODE: SwitchableUiMode = "legacy";

/**
 * The UI that should be rendered right now.
 * A fixed config uiMode always wins; under "dual" the user's last choice
 * wins, then the deployment's defaultUiMode, then legacy.
 */
export const useActiveUiMode = (): SwitchableUiMode => {
  const { uiMode: configUiMode = FALLBACK_UI_MODE, dualUiConfig } = useConfig();
  const chosenUiMode = useAppSelector((state) => state.user.uiMode);

  if (configUiMode !== "dual") return configUiMode;

  return chosenUiMode ?? dualUiConfig?.defaultUiMode ?? FALLBACK_UI_MODE;
};
