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

import moment, { Moment } from "moment";
import { useCallback, useEffect, useState } from "react";
import helpers from "../../../../../modelUtils/mapToQueryVariables";
import { getEarliestFromDate } from "../../../../../utils/saveDialogUtils";

interface ValidBetween {
  fromDate?: string;
  toDate?: string;
}

interface StopPlace {
  id?: string;
  name: string;
  hasExpired?: boolean;
  isChildOfParent?: boolean;
}

export interface WarningInfo {
  stopPlaceId?: string;
  warning?: boolean;
  loading?: boolean;
  error?: boolean;
  activeDatesSize?: number;
  latestActiveDate?: Moment;
  authorities?: string[];
}

interface UseTerminateDialogProps {
  open: boolean;
  stopPlace: StopPlace;
  previousValidBetween?: ValidBetween;
  serverTimeDiff: number;
  isLoading?: boolean;
  warningInfo?: WarningInfo | string;
  handleConfirm: (
    shouldHardDelete: boolean,
    shouldTerminatePermanently: boolean,
    comment: string,
    dateTime: string,
  ) => void;
}

export const useTerminateDialog = ({
  open,
  stopPlace,
  previousValidBetween,
  serverTimeDiff,
  isLoading,
  warningInfo,
  handleConfirm,
}: UseTerminateDialogProps) => {
  const getInitialState = useCallback(() => {
    const earliestFrom = getEarliestFromDate(
      previousValidBetween,
      serverTimeDiff,
    );
    return {
      shouldHardDelete: false,
      shouldTerminatePermanently: false,
      date: moment(earliestFrom),
      time: moment(earliestFrom),
      comment: "",
    };
  }, [previousValidBetween, serverTimeDiff]);

  const [state, setState] = useState(getInitialState());

  useEffect(() => {
    if (open) {
      setState(getInitialState());
    }
  }, [open, getInitialState]);

  const { shouldHardDelete, shouldTerminatePermanently, date, time, comment } =
    state;

  const earliestFrom = getEarliestFromDate(
    previousValidBetween,
    serverTimeDiff,
  );

  const getConfirmIsDisabled = useCallback(() => {
    const { isChildOfParent, hasExpired } = stopPlace;

    // Check if warning info is still loading
    if (
      typeof warningInfo === "object" &&
      warningInfo !== null &&
      warningInfo.loading
    ) {
      return true;
    }

    // Only possible to delete stop if stop has expired
    const expiredNotDeleteCondition = hasExpired
      ? !(hasExpired && shouldHardDelete)
      : false;

    return !!isChildOfParent || isLoading || expiredNotDeleteCondition;
  }, [stopPlace, warningInfo, isLoading, shouldHardDelete]);

  const handleConfirmClick = useCallback(() => {
    const dateTime = helpers.getFullUTCString(time, date);
    handleConfirm(
      shouldHardDelete,
      shouldTerminatePermanently,
      comment,
      dateTime,
    );
  }, [
    time,
    date,
    shouldHardDelete,
    shouldTerminatePermanently,
    comment,
    handleConfirm,
  ]);

  const dateTimeDisabled = shouldHardDelete || !!stopPlace.hasExpired;

  return {
    state,
    setState,
    shouldHardDelete,
    shouldTerminatePermanently,
    date,
    time,
    comment,
    earliestFrom,
    dateTimeDisabled,
    getConfirmIsDisabled,
    handleConfirmClick,
  };
};
