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

/** Field checks for tour files: each reports into `errors` and returns the value only when valid. */

export const MAX_LIST_ITEMS = 30;
export const MAX_TEXT_LENGTH = 2000;

export type Json = Record<string, unknown>;

export const isObject = (value: unknown): value is Json =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const text = (
  value: unknown,
  where: string,
  maxLength: number,
  errors: string[],
  required = true,
): string | undefined => {
  if (value === undefined && !required) return undefined;
  if (typeof value !== "string" || !value.trim()) {
    errors.push(`${where}: must be a non-empty text`);
    return undefined;
  }
  if (value.length > maxLength) {
    errors.push(`${where}: longer than ${maxLength} characters`);
    return undefined;
  }
  return value;
};

export const textList = (
  value: unknown,
  where: string,
  errors: string[],
  required: boolean,
): string[] | undefined => {
  if (value === undefined && !required) return undefined;
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${where}: must be a list with at least one text`);
    return undefined;
  }
  if (value.length > MAX_LIST_ITEMS) {
    errors.push(`${where}: more than ${MAX_LIST_ITEMS} items`);
    return undefined;
  }
  const items = value.map((item, index) =>
    text(item, `${where}[${index + 1}]`, MAX_TEXT_LENGTH, errors),
  );
  return items.every((item) => item !== undefined)
    ? (items as string[])
    : undefined;
};
