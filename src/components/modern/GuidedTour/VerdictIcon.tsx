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

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditNoteIcon from "@mui/icons-material/EditNote";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import type { Verdict } from "./tourSessionStore";

/** A step's verdict as a small coloured icon (unanswered: an empty circle). */
export const VerdictIcon = ({ verdict }: { verdict?: Verdict }) => {
  if (verdict === "works")
    return <CheckCircleIcon fontSize="small" color="success" />;
  if (verdict === "not-fixed")
    return <CancelIcon fontSize="small" color="error" />;
  if (verdict === "change-request")
    return <EditNoteIcon fontSize="small" color="warning" />;
  return (
    <RadioButtonUncheckedIcon
      fontSize="small"
      sx={{ color: "action.disabled" }}
    />
  );
};
