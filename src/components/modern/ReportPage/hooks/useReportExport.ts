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

import moment from "moment";
import { useCallback } from "react";
import {
  ColumnTransformersQuays,
  ColumnTransformersStopPlace,
} from "../../../../models/columnTransformers";
import { jsonArrayToCSV } from "../../../../utils/CSVHelper";
import { ColumnOption } from "../types";

const downloadCSV = (
  items: unknown[],
  columns: ColumnOption[],
  filename: string,
  transformer: Record<string, (item: unknown, ...args: unknown[]) => unknown>,
) => {
  const csv = jsonArrayToCSV(items, columns, ";", transformer);
  const BOM = "\uFEFF";
  const content = BOM + csv;
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const dateNow = moment(new Date()).format("DD-MM-YYYY");
  const fullFilename = `${filename}-${dateNow}.csv`;
  const url = URL.createObjectURL(blob);
  element.href = url;
  element.setAttribute("target", "_blank");
  element.setAttribute("download", fullFilename);
  element.click();
};

export interface UseReportExportResult {
  handleExportStopPlacesCSV: () => void;
  handleExportQuaysCSV: () => void;
}

export const useReportExport = (
  results: unknown[],
  stopColumnOptions: ColumnOption[],
  quayColumnOptions: ColumnOption[],
): UseReportExportResult => {
  const handleExportStopPlacesCSV = useCallback(() => {
    downloadCSV(
      results,
      stopColumnOptions,
      "results-stop-places",
      ColumnTransformersStopPlace as any,
    );
  }, [results, stopColumnOptions]);

  const handleExportQuaysCSV = useCallback(() => {
    let items: unknown[] = [];
    const finalColumns: ColumnOption[] = [
      { id: "stopPlaceId", checked: true },
      { id: "stopPlaceName", checked: true },
      ...quayColumnOptions,
    ];

    (results as any[]).forEach((result) => {
      const quays = result.quays.map((quay: any) => ({
        ...quay,
        stopPlaceId: result.id,
        stopPlaceName: result.name,
      }));
      items = items.concat(quays);
    });

    downloadCSV(
      items,
      finalColumns,
      "results-quays",
      ColumnTransformersQuays as any,
    );
  }, [results, quayColumnOptions]);

  return { handleExportStopPlacesCSV, handleExportQuaysCSV };
};
