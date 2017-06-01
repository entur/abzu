const accessibilityAssements = {
  wheelchairAccess: {
    options: ["TRUE", "FALSE", "UNKNOWN"],
    values: {
      nb: {
        "UNKNOWN": "Ukjent rullestolvennlighet",
        "TRUE": "Rullestolvennlig",
        "FALSE": "Ikke rullestolvennlig",
        "PARTIAL": "Delvis rullestolvennlig",
      },
      en: {
        "UNKNOWN": "Unknown wheelchair accessibility",
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
        "UNKNOWN": "Ukjent trinnadgang",
        "TRUE": "Trinnfri adgang",
        "FALSE": "Adgang med trinn",
        "PARTIAL": "Delvis trinnfri adgang",
      },
      en: {
        "UNKNOWN": "Unknown step access",
        "TRUE": "Step free access",
        "FALSE": "Accessable by steps",
        "PARTIAL": "Partial Step free access",
      }
    },
  },
  colors: {
    "UNKNOWN": "#bfbfbf",
    "TRUE": "rgb(65, 192, 196)",
    "FALSE": "#F44336",
    "PARTIAL": "#FF9800",
  }
}

export default accessibilityAssements