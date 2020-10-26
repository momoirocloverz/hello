import { AxiosRequestConfig } from "axios";
import service from "../axios";
import qs from 'qs'

const prefix = process.env.VUE_APP_API_PREFIX;
const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.get(prefix + url, { params }, config);
const USER_POST = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.post(prefix + url, params, config);
const USER_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);
const USER_DELETE = (url: string, config?: AxiosRequestConfig): any =>
  service.delete(prefix + url, config);
// 列表
export function userList(params = {}, config = {}) {
  return USER_GET("account", params, config);
}
// 新增用户
export function addUser(params = {}, config = {}) {
  return USER_POST("account", params, config);
}
// 编辑用户
export function editUser(params = {}, config = {}) {
  return USER_PUT("account", params, config);
}
// 冻结&启用
export function userIsActive(id: string | number, status: string, config = {}) {
  return USER_PUT(`account/${id}?status=${status}`, config);
}
// 删除用户
export function deleteUser(id: string | number, config = {}) {
  return USER_DELETE(`account/${id}`, config);
}
// 重置密码
export function accountRestPwd(id: string | number, config = {}) {
  return USER_POST(`account/resetPwd`,{ id }, config);
}
// 修改手机号
export function account_updatePhone_api(params = {}, config = {}) {
  return USER_PUT("account/updatePhone", params, config);
}

// 同步微信用户信息
export function wechat_user_sync_api(params = {}, config = {}) {
  return USER_POST("wechat/user/sync",  qs.stringify(params), config);
}
// 同步状态
export function wechat_user_synching_status_api(params = {}, config = {}) {
  return USER_GET("wechat/user/syncInfo", params, config);
}
