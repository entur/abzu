export const getEnvironment = () => {
  if (window.location.hostname === "stoppested.entur.org") {
    return "prod";
  } else if (window.location.hostname === "stoppested.staging.entur.org") {
    return "test";
  } else if (window.location.hostname === "stoppested-nordic.dev.entur.org") {
    return "nordic-dev";
  } else {
    return "dev";
  }
};
