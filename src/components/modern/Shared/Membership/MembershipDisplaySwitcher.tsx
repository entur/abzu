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
import { useDispatch, useSelector } from "react-redux";
import { UserActions } from "../../../../actions";
import { isMembershipVariant, MembershipVariant } from "./types";

/**
 * Evaluation control for the parent/group membership layouts. Labels are
 * intentionally plain English rather than translated — this exists to choose
 * between the approaches, and should be removed together with the losing
 * variants once a decision is made.
 */
const OPTIONS: { value: MembershipVariant; label: string }[] = [
  { value: "chips", label: "1 · Labelled chips (current)" },
  { value: "card", label: "2 · Relations card" },
  { value: "path", label: "3 · Hierarchy path" },
  { value: "section", label: "4 · Collapsible section" },
  { value: "list", label: "5 · Uniform list" },
  { value: "identity", label: "6 · Identity row" },
];

export const MembershipDisplaySwitcher = () => {
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
      slotProps={{ input: { "aria-label": "membership display layout" } }}
      sx={{ fontSize: "0.8125rem" }}
    >
      {OPTIONS.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ fontSize: "0.8125rem" }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};
