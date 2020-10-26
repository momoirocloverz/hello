// eslint-disable-next-line
import { AxiosRequestConfig } from "axios";
import service from "../axios";
import qs from 'qs'

// mock
const prefix = process.env.VUE_APP_API_PREFIX;

const USER_GET = (url: string, params = {}, config?: AxiosRequestConfig) => service.get(`${prefix}${url}`, { params, ...config });
const USER_POST = (url: string, param = {}, config?: AxiosRequestConfig) => service.post(`${prefix}${url}`, param, config);
const USER_PUT = (url: string, params = {}, config?: AxiosRequestConfig): any =>
  service.put(prefix + url, params, config);


export function getUrl(params = {}, config = {}) {
  return USER_GET("url", params, config);
}

/**
 * @description 登录相关接口
 */
/**
 * @description 请求验证码 
 * @params img 没有img 生成二维码，有 img 获取图片地址
 * */
export function get_login_code_api(img?: number | string) {
  let url = img ? `${prefix}common/vercode/imgs/${img}` : USER_POST(`common/vercode/imgs`)
  return url;
}
// 验证账号是否存在 TODO:还没有接口
export function validate_account_api(params = {}, config = {}) {
  return USER_GET(`/crm/member`, params, config);
}
// 提交登录
export function auth_login_api(params = {}, config = {}) {
  return USER_POST(`auth/login`, params, config);
}
// 获取用户信息
export function get_account_id_api(Id: number | string) {
  return USER_GET(`account/${Id}`);
}
// 退出登录
export function auth_forceLogout_api(params = {}, config = {}) {
  return USER_POST(`auth/forceLogout`, qs.stringify(params), config)
}


/**
 * @description 忘记密码相关接口
 */
// 登录页面的忘记密码
export function auth_forgetAndModifyPassword_api(params = {}, config = {}) {
  return USER_POST(`auth/forgetAndModifyPassword`, params, config)
}
// 首次登录修改密码
export function reset_pwd_api(params = {}, config = {}) {
  return USER_POST(`account/resetPwd`, params, config)
}


