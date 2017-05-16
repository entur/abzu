const weightTypes = {
  "nb" : [
    {
      name: "Foretrukket overgang",
      value: "preferredInterchange",
      color: "green",
    }, {
      name: "Anbefalt overgang",
      value: "recommendedInterchange",
      color: "orange",
    }, {
      name: "Ingen overgang",
      value: "noInterchange",
      color: "red"
    },
  ],

  "en" : [
    {
      name: "Preferred interchange",
      value: "preferredInterchange",
      color: "green",
    }, {
      name: "Recommended interchange",
      value: "recommendedInterchange",
      color: "orange",
    }, {
      name: "No interchange",
      value: "noInterchange",
      color: "red",
    }
  ]
}

export const weightColors = {
  preferredInterchange: "green",
  recommendedInterchange: "orange",
  noInterchange: "red"
}

export default weightTypes
