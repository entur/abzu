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

import { useCallback } from "react";
import { AlternativeName } from "../types";

/**
 * Hook for detecting conflicts in alternative names
 * A conflict occurs when adding/editing a translation that already exists for a language
 */
export const useAltNamesConflictDetection = (altNames: AlternativeName[]) => {
  /**
   * Find if there's a conflicting alternative name
   * Returns the index of the conflicting name, or -1 if no conflict
   */
  const getConflictingIndex = useCallback(
    (languageString: string, nameTypeString: string, excludeIndex?: number) => {
      for (let i = 0; i < altNames.length; i++) {
        if (excludeIndex !== undefined && i === excludeIndex) {
          continue; // Skip the item being edited
        }

        const altName = altNames[i];
        if (
          altName.name &&
          nameTypeString === "translation" &&
          altName.name.lang === languageString &&
          altName.nameType === nameTypeString
        ) {
          return i;
        }
      }
      return -1;
    },
    [altNames],
  );

  /**
   * Check if adding a new name would cause a conflict
   */
  const hasConflictForAdd = useCallback(
    (lang: string, type: string) => {
      return getConflictingIndex(lang, type) > -1;
    },
    [getConflictingIndex],
  );

  /**
   * Check if editing a name would cause a conflict
   */
  const hasConflictForEdit = useCallback(
    (lang: string, type: string, editingId: number) => {
      const conflictIndex = getConflictingIndex(lang, type, editingId);
      return conflictIndex > -1 && conflictIndex !== editingId;
    },
    [getConflictingIndex],
  );

  return {
    getConflictingIndex,
    hasConflictForAdd,
    hasConflictForEdit,
  };
};
