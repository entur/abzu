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

import { Button } from "@mui/material";
import React from "react";
import { useIntl } from "react-intl";
import FavoritePopover from "../../../MainPage/FavoritePopover";
import { FavoriteSectionProps } from "../types";

export const FavoriteSection: React.FC<FavoriteSectionProps> = ({
  favorited,
  stopTypeFilter,
  onRetrieveFilter,
  onSaveAsFavorite,
}) => {
  const { formatMessage } = useIntl();

  const favoriteText = {
    title: formatMessage({ id: "favorites_title" }),
    noFavoritesFoundText: formatMessage({ id: "no_favorites_found" }),
  };

  return (
    <div className="favorite-section">
      <FavoritePopover
        caption={formatMessage({ id: "favorites" })}
        items={[]}
        filter={stopTypeFilter}
        onItemClick={onRetrieveFilter}
        onDismiss={() => {}}
        text={favoriteText}
      />

      <div className="favorite-actions">
        <Button
          disabled={favorited}
          onClick={onSaveAsFavorite}
          size="small"
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          {formatMessage({ id: "filter_save_favorite" })}
        </Button>
      </div>
    </div>
  );
};
