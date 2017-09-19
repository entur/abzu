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

// Used for altNamesDialog

export const supportedNameTypes = [
  {
    value: 'alias',
    name: {
      en: 'Alias',
      nb: 'Alias',
    },
  },
  {
    value: 'translation',
    name: {
      en: 'Translation',
      nb: 'Oversettelse',
    },
  },
];

export const allNameTypes = {
  alias: {
    en: 'Alias',
    nb: 'Alias',
  },
  translation: {
    en: 'Translation',
    nb: 'Oversettelse',
  },
  label: {
    en: 'Label',
    nb: 'Merkelapp',
  },
  copy: {
    en: 'Copy',
    nb: 'Kopi',
  },
  other: {
    en: 'Other',
    nb: 'Annet',
  },
};

export const languages = {
  no: {
    en: 'Norwegian',
    nb: 'Norsk',
  },
  nb: {
    en: 'Norwegian (bokmål)',
    nb: 'Norsk (bokmål)',
  },
  nn: {
    en: 'Norwegian (nynorsk)',
    nb: 'Norsk (nynorsk)',
  },
  en: {
    en: 'English',
    nb: 'Engelsk',
  },
  et: {
    en: 'Estonian',
    nb: 'Estisk',
  },
  ru: {
    en: 'Russian',
    nb: 'Russian',
  },
  fi: {
    en: 'Kven language',
    nb: 'Kvensk',
  },
};
