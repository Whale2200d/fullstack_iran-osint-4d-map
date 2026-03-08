/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_CESIUM_ION_TOKEN?: string;
  }
}
