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

export const DEFAULT_LOCALE = "en";

const localization = async (locale, localeConfigDefault, extPath) => {
  const localStorageKey = "ABZU::settings::locale";
  const preferredLocale =
    locale ||
    localStorage.getItem(localStorageKey) ||
    localeConfigDefault ||
    DEFAULT_LOCALE;
  // The default export holds every key. The module's named exports only cover
  // keys that are valid identifiers, which silently drops dotted keys such as
  // "humanReadableErrorCodes.ERROR_STOP_PLACE" (the save error messages).
  const { default: messages } = await import(
    `../static/lang/${preferredLocale}.json`
  );
  const allMessages = await mixInExtMessages(
    messages,
    extPath,
    preferredLocale,
  );

  localStorage.setItem(localStorageKey, preferredLocale);
  return { locale: preferredLocale, messages: allMessages };
};

const mixInExtMessages = async (messages, extPath, preferredLocale) => {
  let extMessages;
  if (extPath) {
    try {
      extMessages = await import(
        `../ext/${extPath}/static/lang/${preferredLocale}.json`
      );
    } catch (error) {}
  }

  if (extMessages?.default) {
    return {
      ...messages,
      ...extMessages.default,
    };
  }

  return messages;
};

export default localization;
