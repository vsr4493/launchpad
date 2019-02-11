declare module '*.png';
declare module '*.jpg';
declare module '*.json';
declare module '*.svg';

declare var __BROWSER__: boolean;

declare interface Window {
  browserHistory: any,
  store: object,
  __PRELOADED_STATE__: object,
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any,
  Hammer: any,
}

declare namespace Express {
   export interface Request {
      store?: object,
   }
}