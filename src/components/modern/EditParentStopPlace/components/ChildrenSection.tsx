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

import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";
import {
  Box,
  CircularProgress,
  Collapse,
  Divider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useIntl } from "react-intl";
import { ChildStopPlace } from "../types";
import { ChildStopItem } from "./ChildStopItem";
import { CollapsibleSectionHeader } from "../../Shared/CollapsibleSectionHeader";

interface ChildrenSectionProps {
  children: ChildStopPlace[];
  canEdit: boolean;
  isLoading?: boolean;
  onAddChildren: () => void;
  onRemoveChild: (stopPlaceId: string) => void;
  navigateTo: (id: string, name: string) => void;
}

export const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  children,
  canEdit,
  isLoading,
  onAddChildren,
  onRemoveChild,
  navigateTo,
}) => {
  const { formatMessage } = useIntl();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <CollapsibleSectionHeader
        icon={<AccountTreeIcon fontSize="small" color="action" />}
        title={formatMessage({ id: "children" })}
        count={children.length}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        action={{
          label: formatMessage({ id: "attach" }),
          tooltip: formatMessage({ id: "add_stop_place" }),
          icon: <LinkIcon fontSize="small" />,
          onClick: onAddChildren,
          disabled: !canEdit || isLoading,
        }}
      />

      <Collapse in={expanded}>
        <Divider />
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!isLoading && children.length === 0 && (
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">
              {formatMessage({ id: "no_children" })}
            </Typography>
          </Box>
        )}
        {children.map((child) => (
          <ChildStopItem
            key={child.id}
            child={child}
            onNavigate={navigateTo}
            onRemove={canEdit ? onRemoveChild : undefined}
          />
        ))}
      </Collapse>
    </>
  );
};
