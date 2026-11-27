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

import { isObject, MAX_TEXT_LENGTH, text, textList } from "./tourValidation";

/** The only tour file format this version reads. */
export const TOUR_FORMAT = "abzu-tour/1";

const MAX_STEPS = 500;
const MAX_ID_LENGTH = 40;
const MAX_TITLE_LENGTH = 200;

export interface TourStep {
  id: string;
  title: string;
  area?: string;
  needsLogin?: boolean;
  /** What the tester does, in order. */
  instructions: string[];
  /** What the tester should see when it works. */
  expected?: string[];
  /** What changed compared with before. */
  changed?: string;
}

export interface Tour {
  format: typeof TOUR_FORMAT;
  title: string;
  branch?: string;
  appVersion?: string;
  intro?: string;
  steps: TourStep[];
}

export type TourParseResult = { tour: Tour } | { errors: string[] };

const parseStep = (
  value: unknown,
  index: number,
  errors: string[],
): TourStep | undefined => {
  const where = `steps[${index + 1}]`;
  if (!isObject(value)) {
    errors.push(`${where}: must be an object`);
    return undefined;
  }
  const before = errors.length;
  const step: TourStep = {
    id: text(value.id, `${where}.id`, MAX_ID_LENGTH, errors) ?? "",
    title: text(value.title, `${where}.title`, MAX_TITLE_LENGTH, errors) ?? "",
    area: text(value.area, `${where}.area`, MAX_TITLE_LENGTH, errors, false),
    instructions:
      textList(value.instructions, `${where}.instructions`, errors, true) ?? [],
    expected: textList(value.expected, `${where}.expected`, errors, false),
    changed: text(
      value.changed,
      `${where}.changed`,
      MAX_TEXT_LENGTH,
      errors,
      false,
    ),
  };
  if (value.needsLogin !== undefined) {
    if (typeof value.needsLogin !== "boolean")
      errors.push(`${where}.needsLogin: must be true or false`);
    else step.needsLogin = value.needsLogin;
  }
  return errors.length === before ? step : undefined;
};

/**
 * Reads a tour file (the developer writes it, the tester uploads it). Only
 * plain texts are accepted and nothing in the file is ever run; anything
 * unexpected is reported, so a broken file never starts half a tour.
 */
export const parseTourFile = (fileText: string): TourParseResult => {
  let data: unknown;
  try {
    data = JSON.parse(fileText);
  } catch {
    return { errors: ["The file is not valid JSON"] };
  }
  if (!isObject(data))
    return { errors: ["The file must contain a JSON object"] };
  if (data.format !== TOUR_FORMAT) {
    return { errors: [`format: must be "${TOUR_FORMAT}"`] };
  }

  const errors: string[] = [];
  const title = text(data.title, "title", MAX_TITLE_LENGTH, errors);
  const branch = text(data.branch, "branch", MAX_TITLE_LENGTH, errors, false);
  const appVersion = text(
    data.appVersion,
    "appVersion",
    MAX_ID_LENGTH,
    errors,
    false,
  );
  const intro = text(data.intro, "intro", MAX_TEXT_LENGTH, errors, false);

  let steps: TourStep[] = [];
  if (!Array.isArray(data.steps) || data.steps.length === 0) {
    errors.push("steps: must be a list with at least one step");
  } else if (data.steps.length > MAX_STEPS) {
    errors.push(`steps: more than ${MAX_STEPS} steps`);
  } else {
    steps = data.steps
      .map((step, index) => parseStep(step, index, errors))
      .filter((step): step is TourStep => step !== undefined);
    const ids = steps.map((step) => step.id);
    const duplicates = [
      ...new Set(ids.filter((id, i) => ids.indexOf(id) !== i)),
    ];
    if (duplicates.length)
      errors.push(`steps: duplicate id ${duplicates.join(", ")}`);
  }

  if (errors.length || !title) return { errors };
  return {
    tour: { format: TOUR_FORMAT, title, branch, appVersion, intro, steps },
  };
};
