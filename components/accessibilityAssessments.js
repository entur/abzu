const accessibilityAssements = {
  wheelchairAccess: {
    options: ["TRUE", "FALSE", "UNKNOWN"],
    values: {
      nb: {
        "UNKNOWN": "Ukjent",
        "TRUE": "Rullestolvennlig",
        "FALSE": "Ikke rullestolvennlig",
        "PARTIAL": "Delvis rullestolvennlig",
      },
      en: {
        "UNKNOWN": "Unknown",
        "TRUE": "Wheelchair friendly",
        "FALSE": "Not wheelchair friendly",
        "PARTIAL": "Partial wheelchair friendly",
      }
    },
  },
  stepFreeAccess: {
    options: ["TRUE", "FALSE", "UNKNOWN"],
    values: {
      nb: {
        "UNKNOWN": "Ukjent",
        "TRUE": "Trinnfri adgang",
        "FALSE": "Adgang med trinn",
        "PARTIAL": "Delvis trinnfri adgang",
      },
      en: {
        "UNKNOWN": "Unknown",
        "TRUE": "Step free access",
        "FALSE": "Accessable by steps",
        "PARTIAL": "Partial Step free access",
      }
    },
  },
  colors: {
    "UNKNOWN": "#bfbfbf",
    "TRUE": "#4CAF50",
    "FALSE": "#F44336",
    "PARTIAL": "#FF9800",
  }
}

export default accessibilityAssements