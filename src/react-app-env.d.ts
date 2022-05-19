/// <reference types="react-scripts" />

export {};

declare module "redux-raven-middleware";
declare module "material-ui/TextField";
declare module "material-ui/svg-icons/action/delete-forever";

declare global {
  interface Window {
    config: {
      endpointBase: string;
    };
  }
}
