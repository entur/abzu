const weightTypes = {
  "nb" : [
    {
      name: "Foretrukket overgang",
      value: "preferredInterchange",
    }, {
      name: "Anbefalt overgang",
      value: "recommendedInterchange",
    }, {
      name: "Overgang tillatt",
      value: "interchangeAllowed",
    },
    {
      name: "Ingen overgang",
      value: "noInterchange",
    },
  ],

  "en" : [
    {
      name: "Preferred interchange",
      value: "preferredInterchange",
    }, {
      name: "Recommended interchange",
      value: "recommendedInterchange",
    }, {
      name: "Interchange allowed",
      value: "interchangeAllowed",
    },{
      name: "No interchange",
      value: "noInterchange",
    }
  ]
}

export const weightColors = {
  preferredInterchange: "#3572b0",
  recommendedInterchange: "#1e6f4c",
  interchangeAllowed: "#2b9e43",
  noInterchange: "#d04437"
}

export default weightTypes
