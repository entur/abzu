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

import { ChangeEvent, useCallback, useState } from "react";
import { parseTourFile, TourParseResult } from "../tourFormat";

export interface TourFileState {
  fileName: string | null;
  result: TourParseResult | null;
  onFileChosen: (event: ChangeEvent<HTMLInputElement>) => void;
  reset: () => void;
}

/** Reads and validates the tour file the tester picks. */
export const useTourFile = (): TourFileState => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [result, setResult] = useState<TourParseResult | null>(null);

  const onFileChosen = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setFileName(file.name);
    file
      .text()
      .then((text) => setResult(parseTourFile(text)))
      .catch(() => setResult({ errors: ["The file could not be read"] }));
  }, []);

  const reset = useCallback(() => {
    setFileName(null);
    setResult(null);
  }, []);

  return { fileName, result, onFileChosen, reset };
};
