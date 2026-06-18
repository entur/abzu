/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import { useCallback, useState } from "react";
import {
  columnOptionsQuays as defaultQuayColumns,
  columnOptionsStopPlace as defaultStopColumns,
} from "../../../../config/columnOptions";
import { ColumnOption } from "../types";

export interface UseReportColumnsResult {
  stopColumnOptions: ColumnOption[];
  quayColumnOptions: ColumnOption[];
  handleColumnStopPlaceToggle: (id: string, checked: boolean) => void;
  handleColumnQuaysToggle: (id: string, checked: boolean) => void;
  handleCheckAllStopColumns: () => void;
  handleCheckAllQuayColumns: () => void;
}

export const useReportColumns = (): UseReportColumnsResult => {
  const [stopColumnOptions, setStopColumnOptions] =
    useState<ColumnOption[]>(defaultStopColumns);
  const [quayColumnOptions, setQuayColumnOptions] =
    useState<ColumnOption[]>(defaultQuayColumns);

  const handleColumnStopPlaceToggle = useCallback(
    (id: string, checked: boolean) => {
      setStopColumnOptions((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked } : opt)),
      );
    },
    [],
  );

  const handleColumnQuaysToggle = useCallback(
    (id: string, checked: boolean) => {
      setQuayColumnOptions((prev) =>
        prev.map((opt) => (opt.id === id ? { ...opt, checked } : opt)),
      );
    },
    [],
  );

  const handleCheckAllStopColumns = useCallback(() => {
    setStopColumnOptions((prev) =>
      prev.map((opt) => ({ ...opt, checked: true })),
    );
  }, []);

  const handleCheckAllQuayColumns = useCallback(() => {
    setQuayColumnOptions((prev) =>
      prev.map((opt) => ({ ...opt, checked: true })),
    );
  }, []);

  return {
    stopColumnOptions,
    quayColumnOptions,
    handleColumnStopPlaceToggle,
    handleColumnQuaysToggle,
    handleCheckAllStopColumns,
    handleCheckAllQuayColumns,
  };
};
