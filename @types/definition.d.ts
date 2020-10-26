declare module "*.png" {
  const value: string;
  export = value;
}
declare module "*.jpg" {
  const value: string;
  export = value;
}
declare module "*.jpeg" {
  const value: string;
  export = value;
}

// 在此只是简单地进行类型描述
declare module "nprogress" {
  export const start: Function;
  export const done: Function;
}

declare module element {
  interface FormRule {
    required?: Boolean;
    message?: string;
    trigger: string | string[];
    validator?: Function;
  }
  interface Refs {
    validate: Function;
    resetFields: Function;
    clearValidate: Function;
  }
  interface Options {
    label: string;
    value: string | number;
  }
  interface Tabs {
    label: string;
    name: string;
  }
}

declare module "@/store" {
  export const state: any;
  export const dispatch: Function;
  export const commit: Function;
}
declare module "qs";
declare module "@d2-projects/d2-crud" {}
declare module "@/plugins/crypt.js" {
  export const encrypt: any;
  export const decrypt: any;
}

declare module "@/plugins/webim.js" {
  export const webim: any;
}
declare module "@femessage/img-preview" {}
declare module "bignumber.js" {}

declare module "vue-amap" {
  export const install: any;
  export const initAMapApiLoader: any;
  export const AMapManager: any;
  export const plugin: any;
  export const Geocoder: any;
}
declare const AMapUI: any;
declare const AMap: any;
declare module "three" {
  export const PerspectiveCamera: any;
  export const CSS3DObject: any;
  export const Object3D: any;
  export const Spherical: any;
  export const Vector3: any;
  export const Cylindrical: any;
  export const Scene: any;
  export const TrackballControls: any;
  export const CSS3DRenderer: any;
}
declare module vehicleConfig {
  interface ConfigValue {
    configCode: string;
    configOptionCode?: string;
    configValue?: string;
    configOptionDesc?: string;
  }
  interface ModelConfigGroups {
    groupCode: string;
    showFlag: "DISPLAY" | "NO_DISPLAY";
  }
  interface ConfigSub {
    configValues?: ConfigValue[];
    modelConfigGroups?: ModelConfigGroups[];
  }
  interface ResourceList {
    code: string;
    type: "BRAND" | "SERIES" | "MODEL";
    urlList: any[];
    urlType: "PICTURE" | "VIDEO" | "AUDIO";
  }
  interface Media {
    url: string;
    name: string;
  }
}
