import service from "@/api/axios";
const adminPrefix = process.env.VUE_APP_API_VERSION;
/**
 * 获取商城banner
 */
const getMallBanner = () => {
  let url = `${adminPrefix}banner/home_page`;
  return service.get(url);
};
/**
 * 获取互动有礼物
 */
const getInteractBanner = () => {
  let url = `${adminPrefix}banner/activity_page`;
  return service.get(url);
};
/**
 * 创建banner
 * @param data
 */
const createActivityBanner = (data: any) => {
  let url = `${adminPrefix}banner/activity`;
  return service.post(url, data);
};
const createHomeBanner=(data:any)=>{
  let url = `${adminPrefix}banner/home`;
  return service.post(url, data);
}
export { getMallBanner, getInteractBanner, createActivityBanner ,createHomeBanner };
