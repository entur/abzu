export enum MobilityFacility {
  TACTILE_PLATFORM_EDGES = "tactilePlatformEdges",
  TACTILE_GUIDING_STRIPS = "tactileGuidingStrips",
  UNKNOWN = "unknown",
  LOW_FLOOR = "lowFloor",
  STEP_FREE_ACCESS = "stepFreeAccess",
  SUITABLE_FOR_PUSHCHAIRS = "suitableForPushchairs",
  SUITABLE_FOR_WHEELCHAIRS = "suitableForWheelchairs",
  SUITABLE_FOR_HEAVILIY_DISABLED = "suitableForHeaviliyDisabled",
  BOARDING_ASSISTANCE = "boardingAssistance",
  ONBOARD_ASSISTANCE = "onboardAssistance",
  UNACCOMPANIED_MINOR_ASSISTANCE = "unaccompaniedMinorAssistance",
}

export enum PassengerInformationEquipment {
  TIMETABLE_POSTER = "timetablePoster",
  FARE_INFORMATION = "fareInformation",
  LINE_NETWORK_PLAN = "lineNetworkPlan",
  LINE_TIMETABLE = "lineTimetable",
  STOP_TIMETABLE = "stopTimetable",
  JOURNEY_PLANNING = "journeyPlanning",
  INTERACTIVE_KIOSK = "interactiveKiosk",
  INFORMATION_DESK = "informationDesk",
  NETWORK_STATUS = "networkStatus",
  REAL_TIME_DISRUPTIONS = "realTimeDisruptions",
  REAL_TIME_DEPARTURES = "realTimeDepartures",
  OTHER = "other",
}

export enum PassengerInformationFacility {
  NEXT_STOP_INDICATOR = "nextStopIndicator",
  STOP_ANNOUNCEMENTS = "stopAnnouncements",
  PASSENGER_INFORMATION_DISPLAY = "passengerInformationDisplay",
  REAL_TIME_CONNECTIONS = "realTimeConnections",
  OTHER = "other",
}

export interface SiteFacilitySet {
  mobilityFacilityList: MobilityFacility[];
  passengerInformationFacilityList: PassengerInformationFacility[];
  passengerInformationEquipmentList: PassengerInformationEquipment[];
}

export const defaultSiteFacilitySet: SiteFacilitySet = {
  mobilityFacilityList: [],
  passengerInformationFacilityList: [],
  passengerInformationEquipmentList: [],
};
