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

import { UserActions } from "../../../actions";
import { SwitchableUiMode, useConfig } from "../../../config/ConfigContext";
import { useAppDispatch } from "../../../store/hooks";
import { useActiveUiMode } from "./useActiveUiMode";
import { useUiModeSwitchLabel } from "./useUiModeSwitchLabel";

/** Runs `leave` now, or once the user has resolved unsaved changes. */
type ConfirmLeave = (leave: () => void) => void;

export interface UiModeSwitchAction {
  label: string;
  switchUiMode: () => void;
}

const OTHER_UI_MODE: Record<SwitchableUiMode, SwitchableUiMode> = {
  legacy: "modern",
  modern: "legacy",
};

const leaveImmediately: ConfirmLeave = (leave) => leave();

/**
 * What a UI switch control shows and does, or null when the deployment's
 * uiMode isn't "dual" or it turned the button off with
 * dualUiConfig.showSwitchButton. Each app renders the control in its own header.
 * Switching unmounts the whole app, so pass the app's unsaved-changes guard
 * as `confirmLeave` where it has one.
 */
export const useUiModeSwitch = (
  confirmLeave: ConfirmLeave = leaveImmediately,
): UiModeSwitchAction | null => {
  const { uiMode, dualUiConfig } = useConfig();
  const dispatch = useAppDispatch();
  const targetUiMode = OTHER_UI_MODE[useActiveUiMode()];
  const label = useUiModeSwitchLabel(targetUiMode);
  const isSwitchButtonEnabled = dualUiConfig?.showSwitchButton ?? true;

  if (uiMode !== "dual" || !isSwitchButtonEnabled) return null;

  const switchUiMode = () =>
    confirmLeave(() => dispatch(UserActions.changeUIMode(targetUiMode)));

  return { label, switchUiMode };
};
