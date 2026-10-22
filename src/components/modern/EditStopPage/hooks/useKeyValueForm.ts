/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *   https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useState } from "react";
import { StopPlaceActions, UserActions } from "../../../../actions";
import { useAppDispatch } from "../../../../store/hooks";
import {
  hasDuplicateValues,
  hasWhitespaceInKey,
  isExistingKey,
  parseKeyValues,
  uniqueValues,
} from "../utils/keyValueRules";

export interface KeyValue {
  key: string;
  values: string[];
}

/** Which element the key-value CRUD actions target. */
export interface KeyValuesOrigin {
  type: "stopPlace" | "quay";
  index: number;
}

export type KeyValueFormMode = "list" | "create" | "edit";

export interface KeyValueForm {
  mode: KeyValueFormMode;
  formKey: string;
  formValues: string;
  setFormKey: (key: string) => void;
  setFormValues: (values: string) => void;
  /** The typed key already exists on this element (create mode only). */
  isDuplicateKey: boolean;
  /** The key has spaces inside it (F-97). */
  isInvalidKey: boolean;
  /** The typed values repeat; repeats are dropped on save. */
  hasRepeatedValues: boolean;
  canSave: boolean;
  startCreate: () => void;
  startEdit: (keyValue: KeyValue) => void;
  cancel: () => void;
  save: () => void;
  remove: (key: string) => void;
}

/**
 * Form state and validation for the key-values tab. A key can't be added
 * twice (F-70) and repeated values are removed before saving (F-71).
 */
export const useKeyValueForm = (
  keyValues: KeyValue[],
  origin: KeyValuesOrigin,
): KeyValueForm => {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<KeyValueFormMode>("list");
  const [editingKey, setEditingKey] = useState("");
  const [formKey, setFormKey] = useState("");
  const [formValues, setFormValues] = useState("");

  const isDuplicateKey = mode === "create" && isExistingKey(keyValues, formKey);
  // Only new keys: keys can't be renamed, so an existing one must stay editable.
  const isInvalidKey = mode === "create" && hasWhitespaceInKey(formKey);
  const hasRepeatedValues = hasDuplicateValues(parseKeyValues(formValues));
  const canSave = Boolean(formKey.trim()) && !isDuplicateKey && !isInvalidKey;

  // The CRUD thunks read the target element from state.user.keyValuesOrigin,
  // so point it at this tab's element (stop place or a quay) before each one.
  const applyOrigin = () => {
    dispatch(UserActions.setKeyValuesOrigin(origin.type, origin.index));
  };

  const fillForm = (nextMode: KeyValueFormMode, keyValue?: KeyValue) => {
    setMode(nextMode);
    setEditingKey(keyValue?.key ?? "");
    setFormKey(keyValue?.key ?? "");
    setFormValues(keyValue?.values.join(", ") ?? "");
  };

  const save = () => {
    if (!canSave) return;
    const values = uniqueValues(parseKeyValues(formValues));
    applyOrigin();
    if (mode === "create") {
      dispatch(StopPlaceActions.createKeyValuesPair(formKey.trim(), values));
    } else if (mode === "edit") {
      dispatch(StopPlaceActions.updateKeyValuesForKey(editingKey, values));
    }
    fillForm("list");
  };

  const remove = (key: string) => {
    applyOrigin();
    dispatch(StopPlaceActions.deleteKeyValuesByKey(key));
  };

  return {
    mode,
    formKey,
    formValues,
    setFormKey,
    setFormValues,
    isDuplicateKey,
    isInvalidKey,
    hasRepeatedValues,
    canSave,
    startCreate: () => fillForm("create"),
    startEdit: (keyValue) => fillForm("edit", keyValue),
    cancel: () => fillForm("list"),
    save,
    remove,
  };
};
