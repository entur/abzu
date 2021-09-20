import React, { useCallback, useState } from "react";
import TextField from "material-ui/TextField";
import { injectIntl } from "react-intl";
import MdDelete from "material-ui/svg-icons/action/delete-forever";
import Code from "./Code";
import Item from "./Item";
import ItemHeader from "./ItemHeader";
import { BoardingPosition } from "./BoardingPositionsTab";
import ToolTippable from "./ToolTippable";
import { IconButton } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { StopPlaceActions } from "../../actions";

type Props = {
  boardingPosition: BoardingPosition;
  disabled: boolean;
  onPublicCodeChange: (publicCode: string) => void;
  onDelete: () => void;
  handleLocateOnMap: () => void;
  intl: any;
  expanded: boolean;
  handleToggleCollapse: () => void;
};

const BoardingPositionItem = ({
  boardingPosition: bp,
  disabled,
  onPublicCodeChange,
  onDelete,
  handleLocateOnMap,
  intl,
  expanded,
  handleToggleCollapse,
}: Props) => {
  return (
    <Item handleChangeCoordinates={() => {}}>
      <ItemHeader
        location={bp.location}
        translations={{}}
        expanded={expanded}
        handleLocateOnMap={handleLocateOnMap}
        handleMissingCoordinatesClick={() => {}} // TODO
        handleToggleCollapse={handleToggleCollapse}
      >
        <span style={{ color: "#2196F3" }}>
          {intl.formatMessage({ id: "boarding_positions_item_header" })}
        </span>
        <Code
          type="publicCode"
          value={bp.publicCode}
          defaultValue={intl.formatMessage({ id: "not_assigned" })}
        />
        <span
          style={{
            fontSize: "0.8em",
            marginLeft: 5,
            fontWeight: 600,
            color: "#464545",
          }}
        >
          {bp.id}
        </span>
      </ItemHeader>
      {!expanded ? null : (
        <div
          style={{ display: "flex" }}
          className="boarding-position-item-expanded"
        >
          <TextField
            hintText={intl.formatMessage({ id: "publicCode" })}
            floatingLabelText={intl.formatMessage({ id: "publicCode" })}
            disabled={disabled}
            value={bp.publicCode}
            style={{ width: "95%", marginTop: -10 }}
            onChange={(e: any) =>
              onPublicCodeChange(e.target.value.substring(0, 3))
            }
          />
          <ToolTippable
            toolTipText={intl.formatMessage({ id: "delete_boarding_position" })}
            toolTipStyle={{ marginLeft: 10 }}
          >
            <IconButton disabled={disabled} onClick={onDelete}>
              <MdDelete />
            </IconButton>
          </ToolTippable>
        </div>
      )}
    </Item>
  );
};

export default injectIntl(BoardingPositionItem);
