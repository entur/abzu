/*
 *  Licensed under the EUPL, Version 1.2 or – as soon they will be approved by
 * the European Commission - subsequent versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the Licence.
 * You may obtain a copy of the Licence at:
 *
 *  https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence. */

export interface FilterState {
  searchQuery: string;
  stopTypeFilter: string[];
  topoiChips: TopographicChip[];
  topographicPlaceFilterValue: string;
  withoutLocationOnly: boolean;
  withDuplicateImportedIds: boolean;
  withNearbySimilarDuplicates: boolean;
  hasParking: boolean;
  showFutureAndExpired: boolean;
  withTags: boolean;
  tags: string[];
}

export interface TopographicChip {
  id: string;
  text: string;
  type: "municipality" | "county" | "country";
  value?: React.ReactNode;
}

export interface ColumnOption {
  id: string;
  checked: boolean;
}

export interface ReportResult {
  id: string;
  name: string;
  stopPlaceType?: string;
  submode?: string;
  isParent?: boolean;
  isChildOfParent?: boolean;
  topographicPlace?: string;
  parentTopographicPlace?: string;
  importedId: string[];
  location?: number[];
  quays: ReportQuay[];
  parking?: ParkingEntry[];
  accessibilityAssessment?: AccessibilityAssessment;
  placeEquipments?: PlaceEquipments;
  modesFromChildren?: Array<{ stopPlaceType: string }>;
  tags: Array<{ name: string; comment?: string }>;
  validBetween?: { fromDate?: string; toDate?: string };
  isFuture?: boolean;
  hasExpired?: boolean;
  permanentlyTerminated?: boolean;
}

export interface ReportQuay {
  id: string;
  importedId: string[];
  location?: number[];
  privateCode?: string;
  publicCode?: string;
  accessibilityAssessment?: AccessibilityAssessment;
  placeEquipments?: PlaceEquipments;
  stopPlaceId?: string;
  stopPlaceName?: string;
}

export interface ParkingEntry {
  id: string;
  parkingVehicleTypes: string[];
}

export interface AccessibilityAssessment {
  limitations?: {
    wheelchairAccess?: string;
    stepFreeAccess?: string;
  };
}

export interface PlaceEquipments {
  shelterEquipment?: unknown[];
  waitingRoomEquipment?: unknown[];
  sanitaryEquipment?: unknown[];
  generalSign?: Array<{
    signContentType: string;
    privateCode?: { value: string };
  }>;
}

export interface DuplicateInfo {
  stopPlacesWithConflict?: string[];
  quaysWithDuplicateImportedIds: Record<string, boolean>;
  fullConflictMap: Record<string, Record<string, string[]>>;
}
