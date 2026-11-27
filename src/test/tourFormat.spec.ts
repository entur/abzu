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

import { describe, expect, test } from "vitest";
import { parseTourFile } from "../components/modern/GuidedTour/tourFormat";

const step = (id: string, extra: object = {}) => ({
  id,
  title: `Step ${id}`,
  instructions: ["Open a stop", "Click Tags"],
  ...extra,
});

const tourJson = (overrides: object = {}) =>
  JSON.stringify({
    format: "abzu-tour/1",
    title: "Round 3",
    steps: [
      step("F-58", { expected: ["The list opens above"], needsLogin: true }),
      step("F-59"),
    ],
    ...overrides,
  });

const errorsOf = (text: string): string[] => {
  const result = parseTourFile(text);
  return "errors" in result ? result.errors : [];
};

describe("parseTourFile", () => {
  test("reads a valid tour with optional fields", () => {
    const result = parseTourFile(
      tourJson({ branch: "fix/x", appVersion: "1.688.0", intro: "Hello" }),
    );
    expect("tour" in result && result.tour).toMatchObject({
      title: "Round 3",
      branch: "fix/x",
      appVersion: "1.688.0",
      intro: "Hello",
      steps: [
        { id: "F-58", needsLogin: true, expected: ["The list opens above"] },
        { id: "F-59" },
      ],
    });
  });

  test("rejects text that isn't JSON or isn't an object", () => {
    expect(errorsOf("not json")).toEqual(["The file is not valid JSON"]);
    expect(errorsOf("[1, 2]")).toEqual(["The file must contain a JSON object"]);
  });

  test("rejects an unknown format", () => {
    expect(errorsOf(tourJson({ format: "abzu-tour/2" }))).toEqual([
      'format: must be "abzu-tour/1"',
    ]);
  });

  test("reports missing required fields, per step", () => {
    const errors = errorsOf(
      tourJson({
        title: "",
        steps: [
          { id: "A", title: "T", instructions: [] },
          { title: "No id", instructions: ["x"] },
        ],
      }),
    );
    expect(errors).toEqual([
      "title: must be a non-empty text",
      "steps[1].instructions: must be a list with at least one text",
      "steps[2].id: must be a non-empty text",
    ]);
  });

  test("rejects an empty step list and duplicate ids", () => {
    expect(errorsOf(tourJson({ steps: [] }))).toEqual([
      "steps: must be a list with at least one step",
    ]);
    expect(errorsOf(tourJson({ steps: [step("A"), step("A")] }))).toEqual([
      "steps: duplicate id A",
    ]);
  });

  test("rejects wrong types and over-long texts", () => {
    expect(
      errorsOf(tourJson({ steps: [step("A", { needsLogin: "yes" })] })),
    ).toEqual(["steps[1].needsLogin: must be true or false"]);
    expect(
      errorsOf(tourJson({ steps: [step("A", { changed: "x".repeat(2001) })] })),
    ).toEqual(["steps[1].changed: longer than 2000 characters"]);
  });

  test("keeps texts as plain strings (no markup is interpreted)", () => {
    const result = parseTourFile(tourJson({ title: "<b>Round</b>" }));
    expect("tour" in result && result.tour.title).toBe("<b>Round</b>");
  });
});
