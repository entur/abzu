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

const accessibilityAssements = {
  wheelchairAccess: {
    options: ['TRUE', 'FALSE', 'UNKNOWN'],
    values: {
      nb: {
        UNKNOWN: 'Ukjent rullestolvennlighet',
        TRUE: 'Rullestolvennlig',
        FALSE: 'Ikke rullestolvennlig',
        PARTIAL: 'Delvis rullestolvennlig',
      },
      en: {
        UNKNOWN: 'Unknown wheelchair accessibility',
        TRUE: 'Wheelchair friendly',
        FALSE: 'Not wheelchair friendly',
        PARTIAL: 'Partial wheelchair friendly',
      },
    },
  },
  stepFreeAccess: {
    options: ['TRUE', 'FALSE', 'UNKNOWN'],
    values: {
      nb: {
        UNKNOWN: 'Ukjent trinnadgang',
        TRUE: 'Trinnfri adgang',
        FALSE: 'Adgang kun med trapper',
        PARTIAL: 'Delvis trinnfri adgang',
      },
      en: {
        UNKNOWN: 'Unknown step access',
        TRUE: 'Step free access',
        FALSE: 'Accessable only by steps',
        PARTIAL: 'Partial Step free access',
      },
    },
  },
  colors: {
    UNKNOWN: '#bfbfbf',
    TRUE: '#37abaf',
    FALSE: '#F44336',
    PARTIAL: '#FF9800',
  },
};

export default accessibilityAssements;
