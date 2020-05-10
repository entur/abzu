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

export default {
  realm_access: {
    roles: [
      "editOrganisation",
      "rutebanken",
      "editRouteData",
      "editStops",
      "uma_authorization",
    ],
  },
  resource_access: {
    account: {
      roles: ["manage-account", "view-profile"],
    },
  },
  roles: [
    '{"r":"editRouteData","o":"RUT"}',
    '{"r":"editOrganisation","o":"RB"}',
  ],
  name: "Test Testesen",
  preferred_username: "test",
  given_name: "Test ",
  family_name: "Testesen",
  email: "test@rutebanken.org",
};
