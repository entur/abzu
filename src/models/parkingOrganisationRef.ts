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

const ORGANISATION_REF_PATTERN = /^[A-Z]{3}:Operator:[A-Za-z0-9_-]+$/;

/**
 * True when the value is blank or holds a reference such as
 * `FSR:Operator:0201256-6`. Spaces around the value do not count, as the save
 * trims them. The id part allows a hyphen, which a Finnish business ID has.
 */
export const isValidOrganisationRef = (value?: string | null): boolean => {
  const trimmed = (value ?? "").trim();
  return trimmed === "" || ORGANISATION_REF_PATTERN.test(trimmed);
};

/**
 * True when a parking whose reference the editor changed holds an invalid
 * value. A stored value that the editor did not change never blocks a save.
 */
export const hasInvalidOrganisationRef = (
  parkings: {
    organisationRef?: string | null;
    organisationRefChanged?: boolean;
  }[] = [],
): boolean =>
  parkings.some(
    (parking) =>
      parking.organisationRefChanged &&
      !isValidOrganisationRef(parking.organisationRef),
  );
