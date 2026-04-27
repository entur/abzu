/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

import AddIcon from "@mui/icons-material/Add";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

interface TagFilterProps {
  selectedTags: string[];
  availableTags: Array<{ name: string; comment?: string }>;
  onTagCheck: (name: string, checked: boolean) => void;
  onLoadTags: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTags,
  availableTags,
  onTagCheck,
  onLoadTags,
}) => {
  const { formatMessage } = useIntl();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filterText, setFilterText] = useState("");
  const [showMore, setShowMore] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      onLoadTags();
    }
  }, [onLoadTags]);

  const filteredTags = availableTags
    .filter((tag) => tag.name.toLowerCase().includes(filterText.toLowerCase()))
    .slice(0, showMore ? availableTags.length : 7);

  return (
    <Box>
      <Box display="flex" flexWrap="wrap" gap={0.5} alignItems="center">
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          {formatMessage({ id: "add_tag" })}
        </Button>
        {selectedTags.map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            onDelete={() => onTagCheck(tag, false)}
            sx={{
              bgcolor: "warning.main",
              color: "warning.contrastText",
              textTransform: "uppercase",
              fontSize: "0.7rem",
            }}
          />
        ))}
      </Box>

      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        disableAutoFocus
      >
        <Box px={1} pb={0.5}>
          <TextField
            variant="standard"
            label={formatMessage({ id: "filter_tags_by_name" })}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            onKeyDown={(e) => e.stopPropagation()}
            autoFocus
            fullWidth
          />
        </Box>
        {filteredTags.length ? (
          filteredTags.map((tag, i) => (
            <MenuItem key={"tag-menuitem-" + i} dense>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedTags.includes(tag.name)}
                    onChange={(_e, checked) => onTagCheck(tag.name, checked)}
                  />
                }
                label={
                  <Typography sx={{ fontSize: "0.9em" }}>{tag.name}</Typography>
                }
              />
            </MenuItem>
          ))
        ) : (
          <Box sx={{ fontSize: "0.8em", textAlign: "center", p: 1.5 }}>
            {formatMessage({ id: "no_tags_found" })}
          </Box>
        )}
        {availableTags.length > 7 && (
          <MenuItem
            dense
            onClick={() => setShowMore((s) => !s)}
            sx={{ justifyContent: "center", fontSize: "0.8em" }}
          >
            {showMore
              ? formatMessage({ id: "filters_less" })
              : formatMessage({ id: "filters_more" })}
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};
