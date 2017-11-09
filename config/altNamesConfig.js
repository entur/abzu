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
      fr: 'Alias',
    },
  },
  {
    value: 'translation',
    name: {
      en: 'Translation',
      nb: 'Oversettelse',
      fr: 'Traduction',
    },
  },
];

export const allNameTypes = {
  alias: {
    en: 'Alias',
    nb: 'Alias',
    fr: 'Alias',
  },
  translation: {
    en: 'Translation',
    nb: 'Oversettelse',
    fr: 'Traduction',
  },
  label: {
    en: 'Label',
    nb: 'Merkelapp',
    fr: 'Libellé',
  },
  copy: {
    en: 'Copy',
    nb: 'Kopi',
    fr: 'Copie',
  },
  other: {
    en: 'Other',
    nb: 'Annet',
    fr: 'Autre',
  },
};

export const getSupportedLocale = locale => {
  const supportedLocales = ['nb', 'en', 'fr'];
  if (supportedLocales.indexOf(locale) > -1) {
    return locale;
  }
  return 'en';
};

/* used temporary for transition between ISO-0639-2 and ISO-0639-3 */
export const getISO6393 = lang => {
  switch (lang) {
    case 'nb':
    case 'nn':
      return 'nor';
    case 'en':
      return 'eng';
    case 'et':
      return 'est';
    case 'fi':
      return 'fin';
    case 'ru':
      return 'rus';
    case 'fr':
      return 'fra';
    default: return 'nor';
  }
};

export const languages = {
  nor: {
    en: 'Norwegian',
    nb: 'Norsk',
    fr: 'Norvégien',
  },
  eng: {
    en: 'English',
    nb: 'Engelsk',
    fr: 'Anglais',
  },
  est: {
    en: 'Estonian',
    nb: 'Estisk',
    fr: 'Estonien',
  },
  fin: {
    en: 'Finnish',
    nb: 'Finsk',
    fr: 'Finnois'
  },
  sme: {
    en: 'Northern Sami',
    nb: 'Nordsamisk',
    fr: 'Sami du Nord'
  },
  rus: {
    en: 'Russian',
    nb: 'Russisk',
    fr: 'Russe',
  },
  fkv: {
    en: 'Kven language',
    nb: 'Kvensk',
    fr: 'Kven',
  },
  fra: {
    en: 'French',
    nb: 'Fransk',
    fr: 'Français',
  }
};
