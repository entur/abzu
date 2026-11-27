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

import { createIntl } from "react-intl";
import { describe, expect, test } from "vitest";
import en from "../static/lang/en.json";
import fi from "../static/lang/fi.json";
import fr from "../static/lang/fr.json";
import nb from "../static/lang/nb.json";
import sv from "../static/lang/sv.json";

const LANGUAGES: Record<string, Record<string, string>> = {
  en,
  nb,
  sv,
  fi,
  fr,
};

/** Broken ICU syntax, e.g. an unescaped "<" read as a tag. */
const FORMAT_ERROR = "FORMAT_ERROR";
const PLACEHOLDER = /\{\s*(\w+)/g;

/** A value for each placeholder in the message; 1 suits text and plurals. */
const valuesFor = (message: string): Record<string, number> =>
  Object.fromEntries(
    [...message.matchAll(PLACEHOLDER)].map(([, name]) => [name, 1]),
  );

describe("language files", () => {
  test.each(Object.keys(LANGUAGES))(
    "every %s message formats without an ICU error",
    (locale) => {
      const errors: string[] = [];
      const intl = createIntl({
        locale,
        messages: LANGUAGES[locale],
        onError: (error) => {
          if (error.code === FORMAT_ERROR) {
            errors.push(error.message.split("\n")[0]);
          }
        },
      });
      Object.entries(LANGUAGES[locale]).forEach(([id, message]) =>
        intl.formatMessage({ id }, valuesFor(message)),
      );
      expect(errors).toEqual([]);
    },
  );

  test("missing comment and name read with angle brackets", () => {
    const intl = createIntl({ locale: "nb", messages: nb });
    expect(intl.formatMessage({ id: "comment_missing" })).toBe(
      "<Mangler kommentar>",
    );
    expect(intl.formatMessage({ id: "is_missing_name" })).toBe(
      "<Mangler navn>",
    );
  });

  test.each(Object.keys(LANGUAGES))(
    "%s keys are in alphabetical order (S-10)",
    (locale) => {
      const keys = Object.keys(LANGUAGES[locale]);
      const sorted = [...keys].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      expect(keys).toEqual(sorted);
    },
  );
});
