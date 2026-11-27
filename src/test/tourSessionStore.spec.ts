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

import { beforeEach, describe, expect, test } from "vitest";
import type { Tour } from "../components/modern/GuidedTour/tourFormat";
import {
  answerOf,
  endTourSession,
  getTourSession,
  goToStep,
  reloadTourSessionForTests,
  setGeneralComment,
  setMinimised,
  setStepAnswer,
  startTourSession,
  subscribeToTourSession,
} from "../components/modern/GuidedTour/tourSessionStore";

const tour = (title = "Round 3", ids = ["F-58", "F-59"]): Tour => ({
  format: "abzu-tour/1",
  title,
  steps: ids.map((id) => ({ id, title: id, instructions: ["Do it"] })),
});

describe("tour session store", () => {
  beforeEach(() => {
    endTourSession();
    localStorage.clear();
  });

  test("starts on the first step with no answers", () => {
    startTourSession(tour(), new Date("2026-11-27T10:00:00Z"));
    expect(getTourSession()).toMatchObject({
      stepIndex: 0,
      answers: {},
      generalComment: "",
      startedAt: "2026-11-27T10:00:00.000Z",
      isMinimised: false,
    });
  });

  test("answers and position survive a reload", () => {
    startTourSession(tour());
    setStepAnswer("F-58", { verdict: "change-request" });
    setStepAnswer("F-58", { comment: "List too narrow" });
    goToStep(1);
    setGeneralComment("Good round");
    reloadTourSessionForTests();

    const session = getTourSession()!;
    expect(session.stepIndex).toBe(1);
    expect(answerOf(session, "F-58")).toEqual({
      verdict: "change-request",
      comment: "List too narrow",
    });
    expect(answerOf(session, "F-59")).toEqual({ comment: "" });
    expect(session.generalComment).toBe("Good round");
  });

  test("starting the same tour again resumes it; another tour replaces it", () => {
    startTourSession(tour());
    setStepAnswer("F-58", { verdict: "works" });
    setMinimised(true);
    startTourSession(tour());
    expect(answerOf(getTourSession()!, "F-58").verdict).toBe("works");
    expect(getTourSession()!.isMinimised).toBe(false);

    startTourSession(tour("Round 4", ["F-130"]));
    expect(getTourSession()!.answers).toEqual({});
    expect(getTourSession()!.tour.title).toBe("Round 4");
  });

  test("step index stays between the first step and the summary page", () => {
    startTourSession(tour());
    goToStep(-3);
    expect(getTourSession()!.stepIndex).toBe(0);
    goToStep(99);
    expect(getTourSession()!.stepIndex).toBe(2);
  });

  test("ending the tour forgets it, also after a reload", () => {
    startTourSession(tour());
    endTourSession();
    reloadTourSessionForTests();
    expect(getTourSession()).toBeNull();
  });

  test("a corrupt stored session is dropped", () => {
    localStorage.setItem(
      "abzu.guidedTour.session",
      JSON.stringify({ tour: { format: "x" } }),
    );
    reloadTourSessionForTests();
    expect(getTourSession()).toBeNull();
  });

  test("subscribers hear every change", () => {
    let calls = 0;
    const unsubscribe = subscribeToTourSession(() => (calls += 1));
    startTourSession(tour());
    setStepAnswer("F-58", { verdict: "works" });
    unsubscribe();
    goToStep(1);
    expect(calls).toBe(2);
  });
});
