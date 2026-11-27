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

import { parseTourFile, Tour } from "./tourFormat";

export type Verdict = "works" | "not-fixed" | "change-request";

export interface StepAnswer {
  verdict?: Verdict;
  comment: string;
}

export interface TourSession {
  tour: Tour;
  /** 0 … steps.length; steps.length is the summary page. */
  stepIndex: number;
  answers: Record<string, StepAnswer>;
  generalComment: string;
  startedAt: string;
  isMinimised: boolean;
}

const STORAGE_KEY = "abzu.guidedTour.session";
const EMPTY_ANSWER: StepAnswer = { comment: "" };

type Listener = () => void;
const listeners = new Set<Listener>();

/** Same tour = same title and step ids, so re-uploading it resumes. */
const tourKey = (tour: Tour): string =>
  `${tour.title}::${tour.steps.map((step) => step.id).join("|")}`;

const load = (): TourSession | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored) as TourSession;
    // Re-validate the stored tour; a corrupt entry is dropped.
    const parsed = parseTourFile(JSON.stringify(session.tour));
    return "tour" in parsed ? { ...session, tour: parsed.tour } : null;
  } catch {
    return null;
  }
};

let current: TourSession | null = load();

const save = (next: TourSession | null): void => {
  current = next;
  try {
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode): the session lives in memory only.
  }
  listeners.forEach((listener) => listener());
};

const update = (change: (session: TourSession) => TourSession): void => {
  if (current) save(change(current));
};

export const getTourSession = (): TourSession | null => current;

export const subscribeToTourSession = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

/** Starts a tour, or resumes it with its answers if it is the same tour. */
export const startTourSession = (tour: Tour, now = new Date()): void => {
  if (current && tourKey(current.tour) === tourKey(tour)) {
    save({ ...current, tour, isMinimised: false });
    return;
  }
  save({
    tour,
    stepIndex: 0,
    answers: {},
    generalComment: "",
    startedAt: now.toISOString(),
    isMinimised: false,
  });
};

export const goToStep = (index: number): void =>
  update((session) => ({
    ...session,
    stepIndex: Math.max(0, Math.min(index, session.tour.steps.length)),
  }));

export const answerOf = (session: TourSession, stepId: string): StepAnswer =>
  session.answers[stepId] ?? EMPTY_ANSWER;

export const setStepAnswer = (
  stepId: string,
  change: Partial<StepAnswer>,
): void =>
  update((session) => ({
    ...session,
    answers: {
      ...session.answers,
      [stepId]: { ...answerOf(session, stepId), ...change },
    },
  }));

export const setGeneralComment = (generalComment: string): void =>
  update((session) => ({ ...session, generalComment }));

export const setMinimised = (isMinimised: boolean): void =>
  update((session) => ({ ...session, isMinimised }));

/** Ends the tour and forgets its answers. */
export const endTourSession = (): void => save(null);

/** For tests: re-read the stored session as if the page reloaded. */
export const reloadTourSessionForTests = (): void => {
  current = load();
};
