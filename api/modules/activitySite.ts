import service from "../axios";
const adminPrefix = process.env.VUE_APP_API_VERSION;
const imPrefix = process.env.VUE_APP_IM;
import { numToUppercase } from "@/utils/";

/**
 * 获取腾讯im登陆相关参数
 * @param data
 */
export const imUserSig = (data: any) => {
  let url = `${imPrefix}userSig?appAccount=${data.appAccount}`;
  return service.post(url);
};

/**
 * 加入群
 * @param data
 */
export const groupMember = (data: any) => {
  let url = `${imPrefix}groupMember`;
  return service.post(url, data);
};

/**
 * 查询群聊签到信息
 * @param params
 */
export const getSignInList = (params: any) => {
  let url = `${adminPrefix}campaign/offline_event/${params.releaseId}/sign/list`;
  return service.get(url, { params });
};
