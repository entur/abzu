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

import WarningIcon from "@mui/icons-material/Warning";
import { Alert, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";

interface TerminationOptionsProps {
  shouldTerminatePermanently: boolean;
  shouldHardDelete: boolean;
  canDeleteStop?: boolean;
  onTerminatePermanentlyChange: (checked: boolean) => void;
  onHardDeleteChange: (checked: boolean) => void;
}

/**
 * Checkboxes for termination options with warning alerts
 */
export const TerminationOptions: React.FC<TerminationOptionsProps> = ({
  shouldTerminatePermanently,
  shouldHardDelete,
  canDeleteStop,
  onTerminatePermanentlyChange,
  onHardDeleteChange,
}) => {
  const { formatMessage } = useIntl();

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={shouldTerminatePermanently}
              onChange={(e) => onTerminatePermanentlyChange(e.target.checked)}
            />
          }
          label={formatMessage({ id: "permanently_terminate_stop_place" })}
        />
        {canDeleteStop && (
          <FormControlLabel
            control={
              <Checkbox
                checked={shouldHardDelete}
                onChange={(e) => onHardDeleteChange(e.target.checked)}
              />
            }
            label={formatMessage({ id: "delete_stop_place" })}
          />
        )}
      </FormGroup>

      {shouldHardDelete && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2, mb: 2 }}>
          {formatMessage({ id: "delete_stop_info" })}
        </Alert>
      )}

      {shouldTerminatePermanently && (
        <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 2, mb: 2 }}>
          {formatMessage({ id: "permanently_terminate_warning" })}
        </Alert>
      )}
    </>
  );
};
