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

import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../../../actions";
import { isMembershipVariant, MembershipVariant } from "./types";

/**
 * Evaluation control for the parent/group membership layouts. It exists to
 * choose between the approaches and should be removed together with the
 * losing variants once a decision is made. Labels are translated (F-11).
 */
const OPTIONS: { value: MembershipVariant; labelId: string }[] = [
  { value: "chips", labelId: "membership_layout_chips" },
  { value: "card", labelId: "membership_layout_card" },
  { value: "path", labelId: "membership_layout_path" },
  { value: "section", labelId: "membership_layout_section" },
  { value: "list", labelId: "membership_layout_list" },
  { value: "identity", labelId: "membership_layout_identity" },
  { value: "stack", labelId: "membership_layout_stack" },
];

export const MembershipDisplaySwitcher = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch() as any;
  const selected = useSelector(
    (state: any) => state.user?.membershipDisplay as unknown,
  );
  const value: MembershipVariant = isMembershipVariant(selected)
    ? selected
    : "chips";

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(UserActions.changeMembershipDisplay(event.target.value));
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      variant="standard"
      size="small"
      fullWidth
      slotProps={{
        input: {
          "aria-label": formatMessage({ id: "membership_layout_label" }),
        },
      }}
      sx={{ fontSize: "0.8125rem" }}
    >
      {OPTIONS.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ fontSize: "0.8125rem" }}
        >
          {formatMessage({ id: option.labelId })}
        </MenuItem>
      ))}
    </Select>
  );
};
