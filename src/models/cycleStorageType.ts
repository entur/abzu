export const cycleStorageType = Object.freeze({
  RACKS: "racks",
  BARS: "bars",
  RAILINGS: "railings",
});

// The values the NeTEx Nordic profile defines. The editor offers these three
// and no other.
export const cycleStorageTypes: string[] = Object.values(cycleStorageType);

// Tiamat can also hold `cycleScheme` and `other`, which the profile does not
// define. A stored value shows its label, and the menu does not offer it.
const labelledTypes = [...cycleStorageTypes, "cycleScheme", "other"];

type FormatMessage = (descriptor: { id: string }) => string;

export const cycleStorageTypeLabel = (
  type: string,
  formatMessage: FormatMessage,
): string =>
  labelledTypes.includes(type)
    ? formatMessage({ id: `parking_cycle_storage_type_${type}` })
    : type;
