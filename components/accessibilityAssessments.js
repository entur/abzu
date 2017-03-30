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
      images: {

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