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

import en_lang from "../../static/lang/en.json";
import fi_lang from "../../static/lang/fi.json";
import fr_lang from "../../static/lang/fr.json";
import nb_lang from "../../static/lang/nb.json";
import sv_lang from "../../static/lang/sv.json";

describe("language support", () => {
  test("should support translations for all strings in all languages", () => {
    const norwegianKeys = Object.keys(nb_lang).sort();
    const englishKeys = Object.keys(en_lang).sort();

    let notInEnglish = norwegianKeys.filter(
      (key) => englishKeys.indexOf(key) === -1,
    );
    let notInNorwegian = englishKeys.filter(
      (key) => norwegianKeys.indexOf(key) === -1,
    );

    if (notInEnglish.length) {
      console.info(
        "Keys found in Norwegian not present in English: ",
        notInEnglish.join(","),
      );
    }

    if (notInNorwegian.length) {
      console.info(
        "Keys found in English not present in Norwegian: ",
        notInNorwegian.join(","),
      );
    }

    expect(JSON.stringify(norwegianKeys)).toEqual(JSON.stringify(englishKeys));
  });

  const NAVIGATION_KEYS = ["navigation_map", "navigation_opens_in_new_tab"];

  test.each([
    ["en", en_lang],
    ["nb", nb_lang],
    ["fi", fi_lang],
    ["fr", fr_lang],
    ["sv", sv_lang],
  ])("%s defines the navigation keys", (_language, translations) => {
    const missing = NAVIGATION_KEYS.filter((key) => !(key in translations));

    expect(missing).toEqual([]);
  });
});
