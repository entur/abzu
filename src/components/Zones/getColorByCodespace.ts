export const getColorByCodespace = (codespace: string) => {
  switch (codespace) {
    case "ATB":
      return "a2ad00";
    case "MOR":
      return "008abf";
    case "BRA":
      return "f3d03e";
    case "VOT":
      return "6ac4ae";
    case "SKY":
      return "d2492a";
    case "INN":
      return "7cc242";
    case "AKT":
      return "007274";
    case "KOL":
      return "a0d635";
    case "TRO":
      return "1bb1e7";
    case "RUT":
      return "e60000";
    case "OST":
      return "337b8d";
    case "NOR":
      return "ffd41f";
    case "FIN":
      return "e74e0f";
    case "VKT":
      return "e74e0f";
    case "TEL":
      return "1bb1e7";
    case "SOF":
      return "ffd41f";
    default:
      return "fff";
  }
};
