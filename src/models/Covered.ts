// The values the NeTEx Nordic profile allows for Covered. The NeTEx schema
// also defines "unknown", which the profile leaves out, so it is not offered.
export enum CoveredEnum {
  COVERED = "covered",
  INDOORS = "indoors",
  OUTDOORS = "outdoors",
  MIXED = "mixed",
}
