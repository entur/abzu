import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { StopPlaceActions } from "../../actions";
import BoardingPositionItem from "./BoardingPositionItem";

export type BoardingPosition = {
  id?: string;
  location: number[];
  publicCode: string;
};

type Quay = {
  boardingPositions: BoardingPosition[];
};

type Props = {
  quay: Quay;
  index: number;
  disabled: boolean;
  focusedElement: any;
};

export default ({ quay, index, disabled, focusedElement }: Props) => {
  const dispatch = useDispatch();
  const handlePublicCodeChange = useCallback(
    (bpIndex: number, newValue: string) => {
      dispatch(
        StopPlaceActions.changeBoardingPositionPublicCode(
          bpIndex,
          index,
          newValue
        )
      );
    },
    [index]
  );

  const handleDelete = useCallback(
    (bpIndex: number) => {
      dispatch(StopPlaceActions.removeBoardingPositionElement(bpIndex, index));
    },
    [index]
  );

  return (
    <div style={{ paddingLeft: "1rem" }}>
      {quay.boardingPositions.map((bp, i) => (
        <BoardingPositionItem
          key={bp.id ?? i}
          boardingPosition={bp}
          disabled={disabled}
          onPublicCodeChange={(newValue: string) =>
            handlePublicCodeChange(i, newValue)
          }
          onDelete={() => handleDelete(i)}
          handleLocateOnMap={() => {
            dispatch(StopPlaceActions.changeMapCenter(bp.location, 17));
            dispatch(
              StopPlaceActions.setBoardingPositionElementFocus(i, index)
            );
          }}
          expanded={
            index === focusedElement.quayIndex && i === focusedElement.index
          }
          handleToggleCollapse={() => {
            dispatch(
              StopPlaceActions.setBoardingPositionElementFocus(
                i === focusedElement.index ? -1 : i,
                index
              )
            );
          }}
        />
      ))}
    </div>
  );
};
