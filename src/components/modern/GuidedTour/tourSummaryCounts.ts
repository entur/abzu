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

import { answerOf, TourSession } from "./tourSessionStore";

export interface VerdictCounts {
  works: number;
  notFixed: number;
  changeRequests: number;
  unanswered: number;
}

/** How many steps got each answer. */
export const countVerdicts = (session: TourSession): VerdictCounts =>
  session.tour.steps.reduce<VerdictCounts>(
    (counts, step) => {
      const { verdict } = answerOf(session, step.id);
      if (verdict === "works") counts.works += 1;
      else if (verdict === "not-fixed") counts.notFixed += 1;
      else if (verdict === "change-request") counts.changeRequests += 1;
      else counts.unanswered += 1;
      return counts;
    },
    { works: 0, notFixed: 0, changeRequests: 0, unanswered: 0 },
  );
