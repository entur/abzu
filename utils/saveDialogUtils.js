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

export const isDateRangeLegal = (
  dateTo,
  dateFrom,
  expiraryExpanded,
  timeFrom,
  timeTo
) => {
  if (!expiraryExpanded) {
    return {
      dateLegal: true,
      timeLegal: true
    };
  }

  if (
    timeTo === null &&
    timeFrom === null &&
    dateTo !== null &&
    dateFrom !== null
  ) {
    return {
      dateLegal: dateTo > dateFrom,
      timeLegal: true
    };
  }

  if (
    timeTo !== null &&
    timeFrom !== null &&
    dateTo !== null &&
    dateFrom !== null
  ) {
    if (dateTo.toDateString() === dateFrom.toDateString()) {
      return {
        dateLegal: true,
        timeLegal: timeTo > timeFrom
      };
    } else {
      return {
        dateLegal: dateTo > dateFrom,
        timeLegal: true
      };
    }
  }
  return {
    dateLegal: dateTo < dateFrom,
    timeLegal: true
  };
};

/* Prevent validBetweeen overlap between versions */
export const getEarliestFromDate = (previousValidBetween, serverDiff = 0) => {
  // Add 100 ms offset to avoid conflicting time
  const msOffset = 100;
  const nowWithOffset = new Date(new Date().getTime() + serverDiff + msOffset);

  if (!previousValidBetween) {
    return nowWithOffset;
  }

  if (previousValidBetween.toDate) {
    const previousToDate = new Date(previousValidBetween.toDate);
    const dateTimeWithOffset = new Date(previousToDate.getTime() + msOffset);
    return dateTimeWithOffset > nowWithOffset
      ? dateTimeWithOffset
      : nowWithOffset;
  } else if (previousValidBetween.fromDate) {
    const previousFromDate = new Date(previousValidBetween.fromDate);
    const dateTimeWithOffset = new Date(previousFromDate.getTime() + msOffset);
    return dateTimeWithOffset > nowWithOffset
      ? dateTimeWithOffset
      : nowWithOffset;
  } else {
    return nowWithOffset; 
  }
};
