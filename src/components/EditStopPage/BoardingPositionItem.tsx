import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import TextField from "material-ui/TextField";
import { injectIntl } from "react-intl";
import Code from "./Code";
import Item from "./Item";
import ItemHeader from "./ItemHeader";
import { BoardingPosition } from "./BoardingPositionsTab";

type Props = {
  boardingPosition: BoardingPosition;
  disabled: boolean;
  onPublicCodeChange: (publicCode: string) => void;
  intl: any;
};

const BoardingPositionItem = ({
  boardingPosition: bp,
  disabled,
  onPublicCodeChange,
  intl,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Item>
      <ItemHeader
        location={bp.location}
        translations={{}}
        expanded={expanded}
        handleLocateOnMap={() => {}} // TODO
        handleMissingCoordinatesClick={() => {}} // TODO
        handleToggleCollapse={() => setExpanded(!expanded)}
      >
        <span style={{ color: "#2196F3" }}>
          {intl.formatMessage({ id: "boarding_positions_item_header" })}
        </span>
        <Code
          type="publicCode"
          value={bp.publicCode}
          defaultValue={intl.formatMessage({ id: "not_assigned" })}
        />
      </ItemHeader>
      {!expanded ? null : (
        <div className="quay-item-expanded">
          <TextField
            hintText={intl.formatMessage({ id: "publicCode" })}
            floatingLabelText={intl.formatMessage({ id: "publicCode" })}
            disabled={disabled}
            defaultValue={bp.publicCode}
            style={{ width: "95%", marginTop: -10 }}
            onChange={(e: any) => onPublicCodeChange(e.target.value)}
          />
        </div>
      )}
    </Item>
  );
};

export default injectIntl(BoardingPositionItem);
