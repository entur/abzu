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
import { checkQuayUsage } from "../../../../graphql/OTP/actions";

export interface QuayUsage {
  isLoading: boolean;
  hasActiveUsage: boolean;
  authorities: string[];
}

const NO_USAGE: QuayUsage = {
  isLoading: false,
  hasActiveUsage: false,
  authorities: [],
};

/**
 * Asks OTP whether a quay is still referenced by service journeys, so the user
 * can be warned before deleting it. Mirrors the aggregation legacy does in
 * `UserActions.requestDeleteQuay`: a quay is "in use" when at least one service
 * journey has an active date, and the authorities behind those lines are listed.
 *
 * Pass `null` to reset — the fetch runs when a quay is queued for deletion.
 * A failed lookup reports no usage, matching legacy's ERROR_QUAY_DELETE_OTP_INFO.
 */
export const useQuayUsageWarning = (quayId: string | null): QuayUsage => {
  const [usage, setUsage] = useState<QuayUsage>(NO_USAGE);

  useEffect(() => {
    if (!quayId) {
      setUsage(NO_USAGE);
      return;
    }

    let isCancelled = false;
    setUsage({ ...NO_USAGE, isLoading: true });

    checkQuayUsage(quayId)
      .then(({ data }: any) => {
        if (isCancelled) return;

        const lines = data?.quay?.lines ?? [];
        const authorities = new Set<string>();
        const activeDates = new Set<string>();

        lines.forEach((line: any) => {
          if (line.authority?.name) {
            authorities.add(line.authority.name);
          }
          (line.serviceJourneys ?? []).forEach((serviceJourney: any) => {
            (serviceJourney.activeDates ?? []).forEach((activeDate: string) => {
              activeDates.add(activeDate);
            });
          });
        });

        setUsage({
          isLoading: false,
          hasActiveUsage: activeDates.size > 0,
          authorities: Array.from(authorities),
        });
      })
      .catch(() => {
        if (isCancelled) return;
        setUsage(NO_USAGE);
      });

    return () => {
      isCancelled = true;
    };
  }, [quayId]);

  return usage;
};
