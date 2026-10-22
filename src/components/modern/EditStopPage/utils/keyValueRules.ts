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

const VALUE_SEPARATOR = ",";
const WHITESPACE = /\s/;

interface KeyValue {
  key: string;
  values: string[];
}

/** Splits the comma-separated values field into trimmed, non-empty values. */
export const parseKeyValues = (input: string): string[] =>
  input
    .split(VALUE_SEPARATOR)
    .map((value) => value.trim())
    .filter(Boolean);

/** Keeps the first occurrence of each value; Tiamat drops repeats anyway (F-71). */
export const uniqueValues = (values: string[]): string[] =>
  Array.from(new Set(values));

export const hasDuplicateValues = (values: string[]): boolean =>
  uniqueValues(values).length !== values.length;

/**
 * A key may exist only once per element: Tiamat keeps the last of two equal
 * keys and silently drops the other's values (F-70). Case-insensitive, as in
 * legacy.
 */
export const isExistingKey = (keyValues: KeyValue[], key: string): boolean => {
  const normalisedKey = key.trim().toLowerCase();
  return keyValues.some((kv) => kv.key.toLowerCase() === normalisedKey);
};

/**
 * Keys are identifiers (e.g. `imported-id`), so they may not contain spaces
 * (F-97). Leading and trailing spaces don't count: the key is trimmed on save.
 */
export const hasWhitespaceInKey = (key: string): boolean =>
  WHITESPACE.test(key.trim());
