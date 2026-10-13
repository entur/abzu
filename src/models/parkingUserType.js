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

const parkingUserType = Object.freeze({
  ALL_USERS: "allUsers",
  REGISTERED_DISABLED: "registeredDisabled",
});

export const parkingUserTypes = Object.values(parkingUserType);

// Tiamat can hold a user type this file does not name. Show the raw value
// rather than dropping it, so the editor still sees what Tiamat stores.
export const parkingUserTypeLabel = (type, formatMessage) =>
  parkingUserTypes.includes(type)
    ? formatMessage({ id: `parking_user_type_${type}` })
    : type;

export default parkingUserType;
