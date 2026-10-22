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

import { useEffect, useState } from "react";
import {
  getPurposeOfGroupingOptions,
  PurposeOfGroupingOption,
} from "../../../../actions/TiamatActions.modern";
import { useAppDispatch } from "../../../../store/hooks";

/** Tiamat's purposes of grouping, loaded once per group editor. */
export const usePurposeOfGroupingOptions = (): PurposeOfGroupingOption[] => {
  const dispatch = useAppDispatch();
  const [options, setOptions] = useState<PurposeOfGroupingOption[]>([]);

  useEffect(() => {
    let isMounted = true;
    dispatch(getPurposeOfGroupingOptions())
      .then((loaded) => {
        if (isMounted) setOptions(loaded);
      })
      // Without options the select stays empty; the saved value is kept.
      .catch(() => undefined);
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return options;
};
