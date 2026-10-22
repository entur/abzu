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

import { useIntl } from "react-intl";
import { SwitchableUiMode, useConfig } from "../../../config/ConfigContext";

const DEFAULT_LABEL_KEYS: Record<SwitchableUiMode, string> = {
  modern: "ui_mode_switch_to_modern",
  legacy: "ui_mode_switch_to_legacy",
};

/**
 * Button text for switching to `targetUiMode`: the deployment's
 * per-locale override from dualUiConfig.switchLabels, else the translation.
 */
export const useUiModeSwitchLabel = (
  targetUiMode: SwitchableUiMode,
): string => {
  const { formatMessage, locale } = useIntl();
  const { dualUiConfig } = useConfig();

  const labelOverrides =
    targetUiMode === "modern"
      ? dualUiConfig?.switchLabels?.toModern
      : dualUiConfig?.switchLabels?.toLegacy;

  return (
    labelOverrides?.[locale] ??
    formatMessage({ id: DEFAULT_LABEL_KEYS[targetUiMode] })
  );
};
