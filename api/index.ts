// const files = require.context("./modules/", false, /(\.ts|\.js)$/);
// const modules: any = {};

// /**
//  * @description 自动集成 ./modules 文件夹下的模块
//  */
// files.keys().forEach(key => {
//   modules[key.replace(/(\.\/|\.ts|\.js)/g, "")] = files(key);
// });

// export default modules;

export * from "./modules/userService";
export * from "./modules/vehicleService";
export * from "./modules/vehicleService-2";
export * from "./modules/appointment";
export * from "./modules/infrastructureSever";
export * from "./modules/userManage";
export * from "./modules/dealerList";
export * from "./modules/iMService";
export * from "./modules/activity";
export * from "./modules/activitySite";
export * from "./modules/statistics";
export * from "./modules/article";
export * from "./modules/consultant";
export * from "./modules/banner";
export * from "./modules/rescue";
export * from "./modules/storeWares";
export * from "./modules/order";
export * from "./modules/comment";
