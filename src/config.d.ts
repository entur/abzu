export {};

declare global {
  interface Window {
    config: {
      sentryDSN: string;
    };
  }
}
