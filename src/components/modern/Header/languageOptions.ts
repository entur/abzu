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

export interface LanguageOption {
  nativeName: string;
  flag: string;
}

// Native names are intentionally not translated — a language's own name
// doesn't change based on the currently active UI locale.
export const LANGUAGE_OPTIONS: Record<string, LanguageOption> = {
  nb: { nativeName: "Norsk", flag: "🇳🇴" },
  en: { nativeName: "English", flag: "🇬🇧" },
  sv: { nativeName: "Svenska", flag: "🇸🇪" },
  fi: { nativeName: "Suomi", flag: "🇫🇮" },
  fr: { nativeName: "Français", flag: "🇫🇷" },
};

export const getLanguageOption = (localeCode: string): LanguageOption =>
  LANGUAGE_OPTIONS[localeCode] ?? { nativeName: localeCode, flag: "" };
