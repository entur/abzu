import { UnknownAction } from "@reduxjs/toolkit";
import { useCallback } from "react";
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
          newValue,
        ) as unknown as UnknownAction,
      );
    },
    [index],
  );

  const handleDelete = useCallback(
    (bpIndex: number) => {
      dispatch(
        StopPlaceActions.removeBoardingPositionElement(
          bpIndex,
          index,
        ) as unknown as UnknownAction,
      );
    },
    [index],
  );

  return (
    <div>
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
            dispatch(
              StopPlaceActions.changeMapCenter(
                bp.location,
                17,
              ) as unknown as UnknownAction,
            );
            dispatch(
              StopPlaceActions.setBoardingPositionElementFocus(
                i,
                index,
              ) as unknown as UnknownAction,
            );
          }}
          expanded={
            index === focusedElement.quayIndex && i === focusedElement.index
          }
          handleToggleCollapse={() => {
            dispatch(
              StopPlaceActions.setBoardingPositionElementFocus(
                i === focusedElement.index ? -1 : i,
                index,
              ) as unknown as UnknownAction,
            );
          }}
        />
      ))}
    </div>
  );
};
