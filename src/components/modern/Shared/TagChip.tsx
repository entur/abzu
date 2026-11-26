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

import TagIcon from "@mui/icons-material/LocalOfferOutlined";
import { Chip, ChipProps } from "@mui/material";

type TagChipProps = Omit<ChipProps, "icon" | "variant" | "size"> & {
  name: string;
};

/**
 * A tag, the same everywhere (F-53): outlined with a tag icon and the tag's
 * own name, so it reads on every theme and isn't mistaken for a warning.
 * Extra props (onDelete, tooltip handlers, ref) pass through to the Chip.
 */
export const TagChip = ({ name, sx, ...chipProps }: TagChipProps) => (
  <Chip
    {...chipProps}
    icon={<TagIcon />}
    label={name}
    size="small"
    variant="outlined"
    sx={[{ fontWeight: 500 }, ...(Array.isArray(sx) ? sx : [sx])]}
  />
);
