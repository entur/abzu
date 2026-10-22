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

const FORBIDDEN_STATUS = 403;
const FORBIDDEN_PATTERN = /insufficient privileges|status code 403/i;
export const INSUFFICIENT_PRIVILEGES_MESSAGE_ID =
  "error_insufficient_privileges";

interface MutationErrorShape {
  statusCode?: number;
  message?: string;
  bodyText?: string;
  errors?: ReadonlyArray<{ message?: string }>;
}

/**
 * Apollo 4 throws a ServerError (with `statusCode`) for an HTTP failure and
 * CombinedGraphQLErrors (with `errors`) for GraphQL errors. Tiamat refuses an
 * edit outside the user's rights with 403 "Insufficient privileges for
 * operation" (F-108), sometimes only as text.
 */
const isForbidden = (error: unknown): boolean => {
  const { statusCode, message, bodyText, errors } = (error ??
    {}) as MutationErrorShape;
  if (statusCode === FORBIDDEN_STATUS) return true;
  const texts = [message, bodyText, ...(errors ?? []).map((e) => e.message)];
  return texts.some(
    (text) => typeof text === "string" && FORBIDDEN_PATTERN.test(text),
  );
};

/** The i18n id that explains a failed mutation to the user. */
export const getMutationErrorMessageId = (
  error: unknown,
  fallbackMessageId: string,
): string =>
  isForbidden(error) ? INSUFFICIENT_PRIVILEGES_MESSAGE_ID : fallbackMessageId;
