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

import { useSelector } from "react-redux";
import { isMembershipVariant, MembershipProps } from "./types";
import { ChipRows } from "./variants/ChipRows";
import { CollapsibleSection } from "./variants/CollapsibleSection";
import { HierarchyPath } from "./variants/HierarchyPath";
import { IdentityRow } from "./variants/IdentityRow";
import { RelationList } from "./variants/RelationList";
import { RelationsCard } from "./variants/RelationsCard";

const VARIANTS = {
  chips: ChipRows,
  card: RelationsCard,
  path: HierarchyPath,
  section: CollapsibleSection,
  list: RelationList,
  identity: IdentityRow,
} as const;

/**
 * Renders a stop place's parent and group memberships in whichever layout is
 * selected under Utseende → membership display. Exists so the alternatives can
 * be compared in the running app; once one wins, the others can be deleted and
 * this indirection collapsed.
 */
export const StopPlaceMembership: React.FC<MembershipProps> = (props) => {
  const selected = useSelector(
    (state: any) => state.user?.membershipDisplay as unknown,
  );
  const variant = isMembershipVariant(selected) ? selected : "chips";

  const hasParent = !!props.parentStop;
  const hasGroups = !!props.groups?.length;
  if (!hasParent && !hasGroups) return null;

  const Variant = VARIANTS[variant];
  return <Variant {...props} />;
};
