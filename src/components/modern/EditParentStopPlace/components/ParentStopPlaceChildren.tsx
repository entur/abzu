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

import { Box, Divider } from "@mui/material";
import { useIntl } from "react-intl";
import { LoadingDialog, useNavigateToStopPlace } from "../../Shared";
import { ParentStopPlaceChildrenProps } from "../types";
import { AdjacentSitesSection } from "./AdjacentSitesSection";
import { ChildrenSection } from "./ChildrenSection";

/**
 * Collapsible children + adjacent sites sections — matches QuaysSection pattern.
 * Navigation loading state is shared via useNavigateToStopPlace so both sections
 * display the same LoadingDialog.
 */
export const ParentStopPlaceChildren: React.FC<
  ParentStopPlaceChildrenProps
> = ({
  children,
  adjacentSites,
  canEdit,
  isLoading,
  onAddChildren,
  onRemoveChild,
  onRemoveAdjacentSite,
  onAddAdjacentSite,
}) => {
  const { formatMessage } = useIntl();
  const { loading, loadingName, navigateTo } = useNavigateToStopPlace();

  return (
    <Box>
      <LoadingDialog
        open={loading}
        message={
          loadingName
            ? `${formatMessage({ id: "loading" })} ${loadingName}`
            : formatMessage({ id: "loading" })
        }
      />

      <Divider />

      <ChildrenSection
        children={children}
        canEdit={canEdit}
        isLoading={isLoading}
        onAddChildren={onAddChildren}
        onRemoveChild={onRemoveChild}
        navigateTo={navigateTo}
      />

      {adjacentSites && adjacentSites.length > 0 && (
        <AdjacentSitesSection
          adjacentSites={adjacentSites}
          canEdit={canEdit}
          onRemoveAdjacentSite={onRemoveAdjacentSite}
          onAddAdjacentSite={onAddAdjacentSite}
          navigateTo={navigateTo}
        />
      )}
    </Box>
  );
};
