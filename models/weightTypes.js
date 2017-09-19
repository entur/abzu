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

const weightTypes = {
  nb: [
    {
      name: 'Foretrukket overgang',
      value: 'preferredInterchange',
    },
    {
      name: 'Anbefalt overgang',
      value: 'recommendedInterchange',
    },
    {
      name: 'Normal overgang',
      value: 'interchangeAllowed',
    },
    {
      name: 'Ingen overgang',
      value: 'noInterchange',
    },
  ],

  en: [
    {
      name: 'Preferred interchange',
      value: 'preferredInterchange',
    },
    {
      name: 'Recommended interchange',
      value: 'recommendedInterchange',
    },
    {
      name: 'Interchange allowed',
      value: 'interchangeAllowed',
    },
    {
      name: 'No interchange',
      value: 'noInterchange',
    },
  ],
};

export const weightColors = {
  preferredInterchange: '#3572b0',
  recommendedInterchange: '#1e6f4c',
  interchangeAllowed: '#2b9e43',
  noInterchange: '#d04437',
};

export const noValue = {
  nb: 'Overgang ikke satt',
  en: 'No interchange set',
};

export default weightTypes;
