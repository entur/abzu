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

import TextField from "@mui/material/TextField";
import React, { useContext } from "react";
import { useIntl } from "react-intl";
import { ConfigContext } from "../../config/ConfigContext";

interface PostalAddressProps {
  addressLine1: string;
  town: string;
  postCode: string;
  onAddressLine1Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTownChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPostCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PostalAddress: React.FC<PostalAddressProps> = ({
  addressLine1,
  town,
  postCode,
  onAddressLine1Change,
  onTownChange,
  onPostCodeChange,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();
  const { featureFlags } = useContext(ConfigContext);

  if (!featureFlags?.StopPlacePostalAddress) {
    return null;
  }

  return (
    <div>
      <TextField
        variant={"standard"}
        label={formatMessage({ id: "postalAddress_addressLine1" })}
        fullWidth={true}
        disabled={disabled}
        value={addressLine1}
        onChange={onAddressLine1Change}
      />
      <TextField
        variant={"standard"}
        label={formatMessage({ id: "postalAddress_town" })}
        fullWidth={true}
        disabled={disabled}
        value={town}
        onChange={onTownChange}
      />
      <TextField
        variant={"standard"}
        label={formatMessage({ id: "postalAddress_postCode" })}
        fullWidth={true}
        disabled={disabled}
        value={postCode}
        onChange={onPostCodeChange}
      />
    </div>
  );
};

export default PostalAddress;
