export {};

declare global {
  interface Window {
    config: {
      endpointBase: string;
      sentryDSN: string;
    };
  }
}