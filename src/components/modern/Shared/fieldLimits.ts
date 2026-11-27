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

/**
 * Tiamat stores free-text fields such as the version comment and the public
 * and private codes in varchar(255) columns. Longer text is refused with a
 * raw SQL error (F-39, F-112), so the fields stop typing at this length.
 */
export const TEXT_FIELD_MAX_LENGTH = 255;
