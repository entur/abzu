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

import React from "react";
import { useIntl } from "react-intl";
import SearchBoxDetails from "../../SearchBoxDetails";
import { SearchResultDetailsProps } from "../types";

export const SearchResultDetails: React.FC<SearchResultDetailsProps> = ({
  result,
  canEdit,
  userSuppliedCoordinates,
  onEdit,
  onChangeCoordinates,
}) => {
  const { formatMessage } = useIntl();

  const text = {
    emptyDescription: formatMessage({ id: "empty_description" }),
    edit: formatMessage({ id: "edit" }),
    view: formatMessage({ id: "view" }),
  };

  return (
    <div className="search-result-details">
      <SearchBoxDetails
        handleEdit={onEdit}
        result={result}
        handleChangeCoordinates={onChangeCoordinates}
        userSuppliedCoordinates={userSuppliedCoordinates}
        text={text}
        canEdit={canEdit}
        formatMessage={formatMessage}
      />
    </div>
  );
};
