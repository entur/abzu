export enum LocalService {
  ASSISTANCE_SERVICE = "assistanceService",
}

export interface AssistanceService {
  assistanceFacilityList: AssistanceFacility[];
  assistanceAvailability: AssistanceAvailability;
}

export enum AssistanceFacility {
  PERSONAL_ASSISTANCE = "personalAssistance",
  BOARDING_ASSISTANCE = "boardingAssistance",
  WHEELCHAIR_ASSISTANCE = "wheelchairAssistance",
  UNACCOMPANIED_MINOR_ASSISTANCE = "unaccompaniedMinorAssistance",
  WHEELCHAIR_USE = "wheelchairUse",
  CONDUCTOR = "conductor",
  INFORMATION = "information",
  OTHER = "other",
  NONE = "none",
  ANY = "any",
}

export enum AssistanceAvailability {
  NONE = "none",
  AVAILABLE = "available",
  AVAILABLE_IF_BOOKED = "availableIfBooked",
  AVAILABLE_AT_CERTAIN_TIMES = "availableAtCertainTimes",
  UNKNOWN = "unknown",
}

export const defaultLocalServices = {
  assistanceService: {
    isChecked: {
      assistanceFacilityList: [AssistanceFacility.ANY],
      assistanceAvailability: AssistanceAvailability.UNKNOWN,
    },
    isUnChecked: {
      assistanceFacilityList: [AssistanceFacility.NONE],
      assistanceAvailability: AssistanceAvailability.NONE,
    },
  },
};
