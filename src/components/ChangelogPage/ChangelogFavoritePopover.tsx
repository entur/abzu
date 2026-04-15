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

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useIntl } from "react-intl";
import type { ChangelogFavorite } from "./types";

interface Props {
  anchorEl: HTMLElement | null;
  favorites: ChangelogFavorite[];
  onLoad: (fav: ChangelogFavorite) => void;
  onDelete: (title: string) => void;
  onClose: () => void;
}

export const ChangelogFavoritePopover = ({
  anchorEl,
  favorites,
  onLoad,
  onDelete,
  onClose,
}: Props) => {
  const { formatMessage } = useIntl();

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <div style={{ minWidth: 280, maxWidth: 400 }}>
        <Typography
          variant="subtitle2"
          style={{ padding: "12px 16px 4px", fontWeight: 600 }}
        >
          {formatMessage({ id: "changelog_saved_filters" })}
        </Typography>
        {favorites.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ padding: "8px 16px 16px" }}
          >
            {formatMessage({ id: "changelog_no_saved_filters" })}
          </Typography>
        ) : (
          <List dense disablePadding>
            {favorites.map((fav) => (
              <ListItem
                key={fav.title}
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    title={formatMessage({ id: "changelog_delete_filter" })}
                    onClick={() => onDelete(fav.title)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => {
                    onLoad(fav);
                    onClose();
                  }}
                >
                  <ListItemText primary={fav.title} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </div>
    </Popover>
  );
};
