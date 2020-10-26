import { AxiosRequestConfig } from "axios";
import service from "../axios";
const prefix = process.env.VUE_APP_API_VERSION;
const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const USER_POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const USER_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const USER_DELETE = (url: string, config?: AxiosRequestConfig): any =>
  service.delete(prefix + url, config);
// 获取顾问列表
export function adviserList(params = {}, config = {}) {
  return USER_GET("adviser/list/new", params, config);
}
// 获取顾问列表
export function adviserListOld(params = {}, config = {}) {
  return USER_GET("adviser/list", params, config);
}
// 冻结&启用顾问
export function consultantSet(id: number, enabled: boolean, config = {}) {
  return USER_PUT(`adviser/${id}/${enabled}`, config);
}
// 顾问修改头像
export function consultantMod(params = {}, config = {}) {
  return USER_PUT(`adviser`, params, config);
}
// 获取顾问下潜客
export function memberList(params = {}, config = {}) {
  return USER_GET("member/by/dealer", params, config);
}
// 转移潜客
export function transferMember(params = {}, config = {}) {
  return USER_PUT(`adviser/transfer/member`, params, config);
}
export function adviserGetComments(params = {}, config = {}) {
  return USER_GET(`adviser/getComments`, params, config);
}
export function getAdviserShares(params = {}, config = {}) {
  return USER_GET(`adviser/getAdviserShares`, params, config);
}