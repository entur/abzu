import React, { useMemo } from "react";
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
};

const sortByPublicCode = (a: BoardingPosition, b: BoardingPosition) => {
  if (a.publicCode > b.publicCode) {
    return 1;
  }
  if (a.publicCode < b.publicCode) {
    return -1;
  }

  return 0;
};

export default ({ quay, index, disabled }: Props) => {
  const dispatch = useDispatch();
  const handlePublicCodeChange = (bpIndex: number, newValue: string) => {
    dispatch(
      StopPlaceActions.changeBoardingPositionPublicCode(
        bpIndex,
        index,
        newValue
      )
    );
  };

  return (
    <div style={{ paddingLeft: "1rem" }}>
      {quay.boardingPositions.sort(sortByPublicCode).map((bp, i) => (
        <BoardingPositionItem
          key={bp.id ?? i}
          boardingPosition={bp}
          disabled={disabled}
          onPublicCodeChange={(newValue) => handlePublicCodeChange(i, newValue)}
        />
      ))}
    </div>
  );
};
